import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { BadRequestException } from '@nestjs/common';
import { Job } from 'bullmq';
import ffmpegStatic from 'ffmpeg-static';
import * as ffmpeg from 'fluent-ffmpeg';
import { rmSync, writeFileSync } from 'fs';
import { ensureDirSync } from 'fs-extra';
import { join } from 'path';
import { VIDEO_QUEUE_NAME } from 'src/configs/bullmq.config';
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
  ) {
    super();
  }

  async process(job: Job<ProcessVideoJobPayload>) {
    const { videoId, userId, videoFileName: fileName, isDeleting } = job.data;
    const relativeOutputDir = join('uploads/videos', `${fileName}`);
    const outputDir = join(process.cwd(), 'uploads/videos', `${fileName}`);

    if (job.name === DELETE_VIDEO_JOB_NAME) {
      rmSync(outputDir, { recursive: true, force: true });
      return;
    }

    if (!userId) throw new BadRequestException();

    const outputPath = join(outputDir, 'playlist.m3u8');

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

      return new Promise((resolve, reject) => {
        const readableStream = new Readable();
        readableStream.push(Buffer.from(fileBuffer));
        readableStream.push(null);

        const command = ffmpeg(readableStream)
          .outputOptions([
            '-f hls',
            '-hls_time 10',
            '-hls_list_size 0',
            '-hls_segment_type mpegts',
            // '-hls_segment_filename',
            // join(outputDir, 'segment_%03d.ts'),
            '-master_pl_name playlist.m3u8',
          ])
          // .output(outputPath)
          .videoCodec('libx264')
          .audioCodec('aac');

        validRenditions.forEach((rendition) => {
          const playlistName = `segment_${rendition.quality}.m3u8`;
          command
            .addOutput(join(outputDir, playlistName))
            .size(`${rendition.resolution[0]}x${rendition.resolution[1]}`);
          if (rendition.videoBitrate)
            command.videoBitrate(rendition.videoBitrate);
          if (rendition.audioBitrate)
            command.audioBitrate(rendition.audioBitrate);
        });

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
            this.videosSseService.sendToClient(
              userId,
              { videoId, progress: percent },
              VideosSseEvents.PROGRESS,
            );
            job.updateProgress(percent);
          })
          .on('end', async () => {
            const masterPlaylistContent = validRenditions
              .map((rendition) => {
                const bandwidth = rendition.videoBitrate
                  ? parseInt(rendition.videoBitrate) * 1000
                  : 5000000;
                return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${rendition.resolution[0]}x${rendition.resolution[1]}\nsegment_${rendition.quality}.m3u8`;
              })
              .join('\n');

            const masterPlaylistPath = join(outputDir, 'playlist.m3u8');
            writeFileSync(
              masterPlaylistPath,
              `#EXTM3U\n${masterPlaylistContent}`,
              'utf-8',
            );

            const relativeMasterPlaylistPath = join(
              relativeOutputDir,
              'playlist.m3u8',
            );

            await this.dbService.video.update({
              where: { id: videoId },
              data: {
                videoSrc: relativeMasterPlaylistPath,
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

            resolve({
              masterPlaylist: relativeMasterPlaylistPath,
              renditions: validRenditions.map((rendition) => ({
                quality: rendition.quality,
                playlist: join(outputDir, `segment_${rendition.quality}.m3u8`),
              })),
            });
          })
          .on('error', async (err) => {
            await this.dbService.video.delete({ where: { id: videoId } });
            reject(err);
          })
          .run();
      });
    } catch (err) {
      rmSync(outputDir, { recursive: true, force: true });
      await this.dbService.video.delete({ where: { id: videoId } });
    }
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {}

  @OnWorkerEvent('completed')
  onComplete(job: Job) {
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
      await this.dbService.video.delete({ where: { id: videoId } });
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
