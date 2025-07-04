import { InjectQueue } from '@nestjs/bullmq'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { createId } from '@paralleldrive/cuid2'
import { Prisma } from '@prisma/client'
import { Queue } from 'bullmq'
import { type Cache } from 'cache-manager'
import { VIDEO_QUEUE_NAME } from 'src/configs/bullmq.config'
import { WebsocketGateway } from 'src/websocket/websocket.gateway'
import { DbService } from './../db/db.service'
import { CreateVideoDto } from './dto/create-video.dto'
import { UpdateVideoDto } from './dto/update-video.dto'
import { DELETE_VIDEO_JOB_NAME, findVideoIncludeConfig } from './videos.config'
import {
  type ProcessVideoJobPayload,
  type VideoFilter,
  VideoFilterEnum,
} from './videos.types'

@Injectable()
export class VideosService {
  constructor(
    @InjectQueue(VIDEO_QUEUE_NAME) private videoQueue: Queue,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private scheduler: SchedulerRegistry,
    private dbService: DbService,
    private socketService: WebsocketGateway,
  ) {}

  async processVideoFile(
    file: Express.Multer.File,
    dto: CreateVideoDto,
    userId: string,
  ) {
    try {
      const video = await this.dbService.video.create({
        data: {
          ...dto,
          title: file.originalname,
          publicId: createId(),
          videoSrc: '',
        },
      });
      const jobPayload: ProcessVideoJobPayload = {
        videoFileName: video.publicId,
        videoFile: file,
        videoId: video.id,
        userId,
      };
      const job = await this.videoQueue.add('process-video', jobPayload);
      await this.createVideoDeletingInterval(video.id);
      return video;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findAllWithPagination(
    searchTerm: string,
    filter: VideoFilter,
    page: number,
    limit: number,
  ) {
    try {
      const options: Prisma.VideoFindManyArgs = {
        where: {
          OR: [
            {
              title: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        },
        include: findVideoIncludeConfig,
        skip: page * limit,
        take: limit,
      };
      const count = await this.dbService.video.count({
        where: {
          OR: [
            {
              title: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        },
      });
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

  async findAll() {
    try {
      return this.dbService.video.findMany();
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getTrendings(page: number, limit: number) {
    try {
      const CACHE_KEY = 'trending_videos';

      const cachedData = await this.cacheManager.get(CACHE_KEY);
      if (cachedData) {
        return cachedData;
      }

      const videos = await this.dbService.video.findMany({
        include: findVideoIncludeConfig,
        orderBy: { createdAt: 'desc' },
      });

      const videosWithRating = videos.map((video) => {
        const rating = this.calculateVideoRating({
          views: video?.views?.length || 0,
          likes: video?.likes?.length || 0,
          dislikes: video?.dislikes?.length || 0,
          createdAt: video.createdAt,
        });
        return { ...video, rating };
      });

      const sortedVideos = videosWithRating.sort((a, b) => b.rating - a.rating);
      return sortedVideos.slice(page * limit, page * limit + limit);
    } catch (error) {
      console.log(error);
      throw new NotFoundException();
    }
  }

  async getGeneralExplore(page: number, limit = 12) {
    try {
      return this.dbService.video.findMany({
        orderBy: {
          views: {
            _count: 'desc',
          },
        },
        skip: page * limit,
        take: limit,
        include: findVideoIncludeConfig,
      });
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getPersonalizedExplore(userId: string, page: number, limit = 12) {
    try {
      const watchedVideos = await this.dbService.history.findMany({
        where: { userId },
        include: { video: { include: { tags: true } } },
        take: 10,
        orderBy: { updatedAt: 'desc' },
      });

      const watchedTags = watchedVideos.flatMap((wv) => wv.video.tags);
      const tagCounts: Record<string, number> = watchedTags.reduce(
        (acc, tag) => {
          acc[tag.id] = (acc[tag.id] || 0) + 1;
          return acc;
        },
        {},
      );

      const topTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag]) => tag);

      const user = await this.dbService.user.findUnique({
        where: { id: userId },
        include: { subscribes: true },
      });
      const subscribes = user?.subscribes || [];
      const subscribedChannelIds = subscribes.map((sub) => sub.id);

      return this.dbService.video.findMany({
        where: {
          OR: [
            { tags: { some: { OR: topTags.map((tag) => ({ name: tag })) } } },
            { channelId: { in: subscribedChannelIds } },
          ],
          NOT: {
            id: { in: watchedVideos.map((wv) => wv.videoId) },
          },
        },
        take: limit,
        skip: page * limit,
        orderBy: [{ views: { _count: 'desc' } }, { likes: { _count: 'desc' } }],
        include: {
          ...findVideoIncludeConfig,
          channel: {
            include: {
              user: true,
            },
          },
        },
      });
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
              likes: true,
              dislikes: true,
              answers: {
                include: { likes: true, dislikes: true, to: true, user: true },
              },
              user: true,
            },
          },
          likes: true,
          dislikes: true,
          views: true,
          resolutions: true,
          tags: true,
        },
      });
      return video;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async findByPublicId(publicId: string) {
    try {
      const video = await this.dbService.video.findUnique({
        where: { publicId },
        include: {
          channel: {
            include: {
              subscribers: true,
            },
          },
          comments: {
            include: {
              likes: true,
              dislikes: true,
              answers: {
                include: { likes: true, dislikes: true, to: true, user: true },
              },
              user: true,
            },
          },
          likes: true,
          dislikes: true,
          views: true,
          resolutions: true,
          tags: true,
        },
      });
      return video;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getSimilarVideos(
    videoId: string,
    page: number = 0,
    limit: number = 10,
  ) {
    try {
      const currentVideo = await this.dbService.video.findUnique({
        where: { id: videoId },
        include: {
          tags: true,
          channel: true,
        },
      });

      if (!currentVideo) {
        throw new NotFoundException();
      }

      const tagIds = currentVideo.tags.map((tag) => tag.id);
      const channelId = currentVideo.channelId;

      const titleWords = currentVideo.title
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 3);

      const [videos, totalCount] = await Promise.all([
        this.dbService.video.findMany({
          where: {
            AND: [
              { id: { not: videoId } },
              {
                OR: [
                  { tags: { some: { id: { in: tagIds } } } },
                  { channelId: channelId },
                  ...titleWords.map((word) => ({
                    title: {
                      contains: word,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  })),
                ],
              },
            ],
          },
          include: findVideoIncludeConfig,
          orderBy: [
            { views: { _count: 'desc' } },
            { likes: { _count: 'desc' } },
            { createdAt: 'desc' },
          ],
          skip: page * limit,
          take: +limit,
        }),
        this.dbService.video.count({
          where: {
            AND: [
              { id: { not: videoId } },
              {
                OR: [
                  { tags: { some: { id: { in: tagIds } } } },
                  { channelId: channelId },
                  ...titleWords.map((word) => ({
                    title: {
                      contains: word,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  })),
                ],
              },
            ],
          },
        }),
      ]);

      return {
        videos,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: (page + 1) * limit < totalCount,
      };
    } catch (error) {
      console.log(error);
      throw new NotFoundException();
    }
  }

  async toggleLike(videoId: string, userId: string, isLiked: boolean) {
    try {
      if (isLiked) {
        const video = await this.dbService.video.update({
          where: { id: videoId },
          data: {
            dislikes: {
              disconnect: { id: userId },
            },
            likes: {
              connect: { id: userId },
            },
          },
        });
        return video;
      } else {
        const video = await this.dbService.video.update({
          where: { id: videoId },
          data: {
            likes: {
              disconnect: { id: userId },
            },
            dislikes: {
              connect: { id: userId },
            },
          },
        });
        return video;
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async update(
    id: string,
    updateVideoDto: UpdateVideoDto,
    isUploading?: boolean,
  ) {
    try {
      const { tags, thumbnailUrl, ...dto } = updateVideoDto;
      const oldVideo = await this.dbService.video.findUnique({
        where: { id },
        select: { tags: true, thumbnailUrl: true },
      });
      const oldTags = oldVideo?.tags.map((tag) => ({ name: tag.name })) || [];
      const video = await this.dbService.video.update({
        where: { id },
        data: {
          ...dto,
          thumbnailUrl: !thumbnailUrl
            ? dto.isDeletingThumbnail
              ? null
              : oldVideo?.thumbnailUrl
            : thumbnailUrl?.replace(/\\/g, '/'),
          tags: tags
            ? {
                disconnect: oldTags,
                connectOrCreate: tags.map((tag) => ({
                  create: { name: tag },
                  where: { name: tag },
                })),
              }
            : {},
        },
        include: {
          channel: {
            include: {
              subscribers: true,
            },
          },
        },
      });
      if (isUploading && video?.channel?.subscribers) {
        await this.socketService.sendNotificationToUsers(
          video.channel.subscribers.map((sub) => sub.id),
          {
            text: `New video on channel "${video.channel.title}"!`,
            link: `/v/${video.publicId}`,
          },
        );
      }
      return video;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: string) {
    try {
      const video = await this.dbService.video.delete({
        where: { id },
        include: {
          channel: true,
        },
      });
      const job = await this.videoQueue.add(DELETE_VIDEO_JOB_NAME, {
        videoFileName: video.publicId,
        isDeleting: true,
      });
      return video;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  private calculateVideoRating(video: {
    views: number;
    likes: number;
    dislikes: number;
    createdAt: Date;
  }) {
    const { views, likes, dislikes, createdAt } = video;

    const viewsWeight = 0.5;
    const likesWeight = 0.3;
    const engagementWeight = 0.2;

    const normalizedLikes = likes / (likes + dislikes + 1);
    const engagementRate = (likes + dislikes) / (views + 1);

    const now = new Date();
    const hoursSinceUpload =
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    const timeBonus = Math.max(0, 1 - hoursSinceUpload / 72);

    const rating =
      Math.log(views + 1) * viewsWeight +
      normalizedLikes * likesWeight +
      engagementRate * engagementWeight +
      timeBonus * 0.1;

    return rating;
  }

  private async createVideoDeletingInterval(videoId: string) {
    const callback = async () => {
      try {
        const video = await this.dbService.video.deleteMany({
          where: { id: videoId, videoSrc: '' },
        });
      } catch {}
    };
    const interval = setInterval(callback, 1000 * 60 * 60 * 24);
    this.scheduler.addInterval(videoId, interval);
  }
}
