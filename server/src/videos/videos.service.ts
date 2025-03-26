import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { Prisma } from '@prisma/client';
import { Queue } from 'bullmq';
import { VIDEO_QUEUE_NAME } from 'src/configs/bullmq.config';
import { DbService } from './../db/db.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import {
  ProcessVideoJobPayload,
  VideoFilter,
  VideoFilterEnum,
} from './videos.types';

@Injectable()
export class VideosService {
  constructor(
    @InjectQueue(VIDEO_QUEUE_NAME) private videoQueue: Queue,
    private dbService: DbService,
  ) {}

  async processVideoFile(
    file: Express.Multer.File,
    dto: CreateVideoDto,
    userId: string,
  ) {
    try {
      const video = await this.dbService.video.create({
        data: { ...dto, publicId: createId(), videoSrc: '' },
      });
      const jobPayload: ProcessVideoJobPayload = {
        videoFileName: video.publicId,
        videoFile: file,
        videoId: video.id,
        userId,
      };
      const job = await this.videoQueue.add('process-video', jobPayload);

      return video;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findAll(filter: VideoFilter, page: number, limit: number) {
    try {
      const options: Prisma.VideoFindManyArgs = {
        include: {
          likes: true,
          channel: true,
          views: true,
        },
        skip: page * limit,
        take: limit,
      };
      const count = await this.dbService.video.count();
      switch (filter) {
        case VideoFilterEnum.POPULAR:
          return {
            videos: await this.dbService.video.findMany({
              ...options,
              orderBy: { views: { _count: 'desc' } },
            }),
            totalCount: count,
          };
          break;
        case VideoFilterEnum.NEWEST:
          return {
            videos: await this.dbService.video.findMany({
              ...options,
              orderBy: { createdAt: 'desc' },
            }),
            totalCount: count,
          };
          break;
        case VideoFilterEnum.LATEST:
          return {
            videos: await this.dbService.video.findMany({
              ...options,
              orderBy: { createdAt: 'asc' },
            }),
            totalCount: count,
          };
          break;
        case VideoFilterEnum.LIKES:
          return {
            videos: await this.dbService.video.findMany({
              ...options,
              orderBy: { likes: { _count: 'desc' } },
            }),
            totalCount: count,
          };
          break;
        default:
          throw 'error';
          break;
      }
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async findOne(id: string) {
    try {
      const video = await this.dbService.video.findUnique({
        where: { id },
        include: {
          channel: {
            include: {
              subscribers: true,
            },
          },
          comments: {
            include: {
              answers: {
                include: { likes: true, dislikes: true, to: true, user: true },
              },
              likes: true,
              dislikes: true,
              user: true,
            },
          },
          likes: true,
          dislikes: true,
          views: true,
          resolutions: true,
        },
      });
      return video;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async update(id: string, updateVideoDto: UpdateVideoDto) {
    try {
      const video = await this.dbService.video.update({
        where: { id },
        data: updateVideoDto,
      });
      return video;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: string) {
    try {
      const video = await this.dbService.video.delete({
        where: { id },
      });
      return video;
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
