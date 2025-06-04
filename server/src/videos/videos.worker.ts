import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { BadRequestException } from '@nestjs/common';
import { Job } from 'bullmq';
import ffmpegStatic from 'ffmpeg-static';
import * as ffmpeg from 'fluent-ffmpeg';
import { rmSync, writeFileSync } from 'fs';
import { ensureDirSync } from 'fs-extra';
import { join } from 'path';
import { VIDEO_QUEUE_NAME } from 'src/configs/bullmq.config';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { Readable } from 'stream';
import { DbService } from './../db/db.service';
import { DELETE_VIDEO_JOB_NAME } from './videos.config';
import { RENDITIONS } from './videos.constants';
import { VideosSseEvents, VideosSseService } from './videos.sse';
import { type ProcessVideoJobPayload } from './videos.types';

ffmpegStatic && ffmpeg.setFfmpegPath(ffmpegStatic);

@Processor(VIDEO_QUEUE_NAME, { concurrency: 1 })
export class VideosWorker extends WorkerHost {
  constructor(
    private dbService: DbService,
    private videosSseService: VideosSseService,
    private socketService: WebsocketGateway,
  ) {
    super();
  }

  async process(job: Job<ProcessVideoJobPayload>) {
    const { videoId, userId, videoFileName: fileName, isDeleting } = job.data;
    const relativeOutputDir = join('uploads/videos', `${fileName}`);
    const outputDir = join(process.cwd(), 'uploads/videos', `${fileName}`);
    const thumbnailsDir = join(process.cwd(), 'uploads/videos-thumbnails');

    if (job.name === DELETE_VIDEO_JOB_NAME) {
      rmSync(outputDir, { recursive: true, force: true });
      return;
    }

    if (!userId) throw new BadRequestException();

    ensureDirSync(outputDir);

    const fileBuffer = job.data.videoFile.buffer;

    try {
      const originalResolution =
        await this.getVideoResolutionFromBuffer(fileBuffer);

      const validRenditions = RENDITIONS.filter(
        (rendition) =>
          rendition.resolution[0] <= originalResolution.width ||
          rendition.resolution[1] <= originalResolution.height,
      );

      if (
        validRenditions.length === 0 ||
        !validRenditions.some(
          (rendition) =>
            rendition.resolution[0] === originalResolution.width ||
            rendition.resolution[1] === originalResolution.height,
        )
      ) {
        validRenditions.unshift({
          quality: 'original',
          resolution: [originalResolution.width, originalResolution.height],
          videoBitrate: '5000k',
          audioBitrate: '192k',
        });
      }

      // Создаем скриншоты
      const screenshotTimes = [1, 5, 10];
      const screenshotPromises = screenshotTimes.map((time) => {
        return new Promise<string | null>((resolveScreenshot) => {
          const screenshotStream = new Readable();
          screenshotStream.push(Buffer.from(fileBuffer));
          screenshotStream.push(null);

          ffmpeg(screenshotStream)
            .screenshot({
              count: 1,
              timemarks: [time],
              filename: `${videoId}.jpg`,
              folder: thumbnailsDir,
              size: `${originalResolution.width}x${originalResolution.height}`,
            })
            .on('end', () => resolveScreenshot(`${videoId}.jpg`))
            .on('error', () => resolveScreenshot(null));
        });
      });

      const progresses = new Map<string, number>();

      // Обрабатываем каждое разрешение отдельной командой
      const encodingPromises = validRenditions.map((rendition) => {
        return new Promise<void>((resolve, reject) => {
          const readableStream = new Readable();
          readableStream.push(Buffer.from(fileBuffer));
          readableStream.push(null);

          const playlistName = `segment_${rendition.quality}.m3u8`;
          const segmentPattern = `segment_${rendition.quality}_%03d.ts`;

          const command = ffmpeg(readableStream)
            .output(join(outputDir, playlistName))
            .size(`${rendition.resolution[0]}x${rendition.resolution[1]}`)
            .outputOptions([
              '-f hls',
              '-hls_time 10',
              '-hls_list_size 0',
              '-hls_segment_type mpegts',
              `-hls_segment_filename ${join(outputDir, segmentPattern)}`,
            ])
            .videoCodec('libx264')
            .audioCodec('aac');

          if (rendition.videoBitrate)
            command.videoBitrate(rendition.videoBitrate);
          if (rendition.audioBitrate)
            command.audioBitrate(rendition.audioBitrate);

          let totalDuration = 0;

          command
            .on('codecData', (data) => {
              const [hours, mins, secs] = data.duration
                .split(':')
                .map(parseFloat);
              totalDuration = hours * 3600 + mins * 60 + secs;
            })
            .on('progress', (progress) => {
              let percent = 0;

              if (progress.timemark && totalDuration > 0) {
                const [hours, mins, secs] = progress.timemark
                  .split(':')
                  .map(parseFloat);
                const currentTime = hours * 3600 + mins * 60 + secs;
                percent = Math.round((currentTime / totalDuration) * 100);
              } else if (progress?.percent) {
                percent = Math.round(progress.percent);
              }

              if (!percent) return;

              progresses.set(rendition.quality, percent);
              const maxProgress = Math.max(...progresses.values());
              this.videosSseService.sendToClient(
                userId,
                { videoId, progress: Math.min(maxProgress, 99) },
                VideosSseEvents.PROGRESS,
              );
              job.updateProgress(percent);
            })
            .on('end', () => resolve())
            .on('error', (err) => reject(err))
            .run();
        });
      });

      // Ждем завершения всех обработок
      await Promise.all(encodingPromises);

      // Создаем мастер-плейлист
      const masterPlaylistContent = validRenditions
        .map((rendition) => {
          const bandwidth = rendition.videoBitrate
            ? parseInt(rendition.videoBitrate) * 1000
            : 5000000;
          return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${rendition.resolution[0]}x${rendition.resolution[1]}\nsegment_${rendition.quality}.m3u8`;
        })
        .join('\n');

      writeFileSync(
        join(outputDir, 'playlist.m3u8'),
        `#EXTM3U\n${masterPlaylistContent}`,
        'utf-8',
      );

      // Обрабатываем скриншоты
      const screenshotResults = await Promise.all(screenshotPromises);
      const mainThumbnail = screenshotResults.filter(Boolean)[0] || null;

      // Обновляем данные в БД
      await this.dbService.video.update({
        where: { id: videoId },
        data: {
          thumbnailUrl: mainThumbnail
            ? '/videos-thumbnails/' + mainThumbnail
            : null,
          videoSrc: join(relativeOutputDir, 'playlist.m3u8'),
          resolutions: {
            connectOrCreate: validRenditions
              .filter((rendition) => rendition.quality !== 'original')
              .map((rendition) => ({
                where: { quality: rendition.quality },
                create: {
                  quality: rendition.quality,
                  resolution: rendition.resolution,
                },
              })),
          },
        },
      });

      this.videosSseService.sendToClient(
        userId,
        { videoId, success: true },
        VideosSseEvents.SUCCESS,
      );

      return {
        masterPlaylist: join(relativeOutputDir, 'playlist.m3u8'),
        renditions: validRenditions.map((rendition) => ({
          quality: rendition.quality,
          playlist: join(outputDir, `segment_${rendition.quality}.m3u8`),
        })),
      };
    } catch (err) {
      rmSync(outputDir, { recursive: true, force: true });
      await this.dbService.video.deleteMany({ where: { id: videoId } });
      throw err;
    }
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {}

  @OnWorkerEvent('completed')
  async onComplete(job: Job) {
    const { userId, videoId } = job.data;
    this.videosSseService.sendToClient(
      userId,
      { videoId, success: true },
      VideosSseEvents.PROGRESS,
    );
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job, error: Error) {
    const { userId, videoId, videoFileName: fileName } = job.data;
    if (!fileName || !videoId) return;
    this.videosSseService.sendToClient(
      userId,
      { videoId, error: true },
      VideosSseEvents.ERROR,
    );
    const outputDir = join(process.cwd(), 'uploads/videos', `${fileName}`);
    rmSync(outputDir, { recursive: true, force: true });
    try {
      await this.dbService.video.deleteMany({ where: { id: videoId } });
    } catch {}
  }

  private async getVideoResolutionFromBuffer(
    fileBuffer: Buffer,
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const readableStream = new Readable();
      readableStream.push(Buffer.from(fileBuffer));
      readableStream.push(null);
      //@ts-ignore
      ffmpeg.ffprobe(readableStream, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          const videoStream = metadata.streams.find(
            (stream) => stream.codec_type === 'video',
          );
          if (videoStream && videoStream.width && videoStream.height) {
            resolve({ width: videoStream.width, height: videoStream.height });
          } else {
            reject(new Error('Video stream not found!'));
          }
        }
      });
    });
  }
}
