import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import ffmpegStatic from 'ffmpeg-static';
import * as ffmpeg from 'fluent-ffmpeg';
import { rmSync, writeFileSync } from 'fs';
import { ensureDirSync } from 'fs-extra';
import { join } from 'path';
import { VIDEO_QUEUE_NAME } from 'src/configs/bullmq.config';
import { Readable } from 'stream';
import { DbService } from './../db/db.service';
import { ProcessVideoJobPayload } from './videos.types';

ffmpegStatic && ffmpeg.setFfmpegPath(ffmpegStatic);

@Processor(VIDEO_QUEUE_NAME, { concurrency: 1 })
export class VideosWorker extends WorkerHost {
  constructor(private dbService: DbService) {
    super();
  }

  async process(job: Job<ProcessVideoJobPayload>) {
    const fileBuffer = job.data.videoFile.buffer;
    const { videoId, videoFileName: fileName } = job.data;
    const outputDir = join(
      __dirname,
      '..',
      '..',
      'uploads/videos',
      `${fileName}`,
    );
    const relativeOutputDir = join('uploads/videos', `${fileName}`);
    const outputPath = join(outputDir, 'playlist.m3u8');

    ensureDirSync(outputDir);

    try {
      const originalResolution =
        await this.getVideoResolutionFromBuffer(fileBuffer);

      const renditions = [
        {
          quality: '2160p',
          resolution: [3840, 2160],
          videoBitrate: '5000k',
          audioBitrate: '192k',
        },
        {
          quality: '1440p',
          resolution: [2560, 1440],
          videoBitrate: '3000k',
          audioBitrate: '192k',
        },
        {
          quality: '1080p',
          resolution: [1920, 1080],
          videoBitrate: '2000k',
          audioBitrate: '128k',
        },
        {
          quality: '720p',
          resolution: [1280, 720],
          videoBitrate: '1000k',
          audioBitrate: '128k',
        },
        {
          quality: '480p',
          resolution: [854, 480],
          videoBitrate: '800k',
          audioBitrate: '96k',
        },
        {
          quality: '360p',
          resolution: [640, 360],
          videoBitrate: '500k',
          audioBitrate: '96k',
        },
        {
          quality: '240p',
          resolution: [426, 240],
          videoBitrate: '300k',
          audioBitrate: '64k',
        },
        {
          quality: '144p',
          resolution: [256, 144],
          videoBitrate: '200k',
          audioBitrate: '48k',
        },
      ];

      const validRenditions = renditions.filter(
        (rendition) =>
          rendition.resolution[0] <= originalResolution.width &&
          rendition.resolution[1] <= originalResolution.height,
      );

      // Добавляем оригинальное разрешение, если оно не соответствует ни одному из предопределенных качеств
      if (
        validRenditions.length === 0 ||
        !validRenditions.some(
          (rendition) =>
            rendition.resolution[0] === originalResolution.width &&
            rendition.resolution[1] === originalResolution.height,
        )
      ) {
        validRenditions.push({
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
            '-hls_segment_filename',
            join(outputDir, 'segment_%03d.ts'),
            '-master_pl_name playlist.m3u8',
          ])
          .output(outputPath)
          .videoCodec('libx264')
          .audioCodec('aac');

        // Добавляем выходы для каждого качества, включая оригинальное разрешение
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

        command
          .on('progress', (progress) => {
            console.log('Progress ', progress);
            progress.percent && job.updateProgress(progress.percent);
          })
          .on('end', async () => {
            // Генерация мастер-плейлиста вручную
            const masterPlaylistContent = validRenditions
              .map((rendition) => {
                const bandwidth = rendition.videoBitrate
                  ? parseInt(rendition.videoBitrate) * 1000
                  : 5000000; // По умолчанию 5000kbps, если битрейт не указан
                return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${rendition.resolution[0]}x${rendition.resolution[1]}\nsegment_${rendition.quality}.m3u8`;
              })
              .join('\n');

            const masterPlaylistPath = join(relativeOutputDir, 'playlist.m3u8');
            writeFileSync(
              masterPlaylistPath,
              `#EXTM3U\n${masterPlaylistContent}`,
              'utf-8',
            );

            await this.dbService.video.update({
              where: { id: videoId },
              data: { videoSrc: masterPlaylistPath },
            });

            resolve({
              masterPlaylist: masterPlaylistPath,
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
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job, error: Error) {
    const { videoId, videoFileName: fileName } = job.data;
    if (!fileName || !videoId) return;
    const outputDir = join(
      __dirname,
      '..',
      '..',
      'uploads/videos',
      `${fileName}`,
    );
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
            reject(new Error('Видео поток не найден'));
          }
        }
      });
    });
  }
}
