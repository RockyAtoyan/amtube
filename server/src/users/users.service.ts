import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as bcrypt from 'bcrypt';
import { findVideoIncludeConfig } from 'src/videos/videos.config';
import { DbService } from './../db/db.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { findUserIncludeConfig } from './users.config';

@Injectable()
export class UsersService {
  constructor(private dbService: DbService) {}

  async findById(id: string) {
    const user = await this.dbService.user.findUnique({
      where: { id },
      include: findUserIncludeConfig,
    });
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    const user = await this.dbService.user.findUnique({
      where: { email },
      include: findUserIncludeConfig,
    });
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }

  async findByName(name: string) {
    const user = await this.dbService.user.findUnique({
      where: { name },
      include: findUserIncludeConfig,
    });
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }

  async getUserHistory(userId: string) {
    try {
      const history = await this.dbService.history.findMany({
        where: { userId },
        include: {
          video: {
            include: findVideoIncludeConfig,
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
      const videos = history.map((h) => h.video);
      return videos;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getUserSubscribesVideos(userId: string) {
    try {
      const channels = await this.dbService.channel.findMany({
        where: {
          subscribers: {
            some: {
              id: userId,
            },
          },
        },
        include: {
          videos: {
            include: findVideoIncludeConfig,
          },
        },
      });
      const videos = channels
        .reduce((vs, v) => {
          return [...vs, ...v.videos];
        }, [])
        .toSorted((v1, v2) => +v2.createdAt - +v1.createdAt);
      return videos;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getUserLikedVideos(userId: string) {
    try {
      const videos = await this.dbService.video.findMany({
        where: {
          likes: {
            some: {
              id: userId,
            },
          },
        },
        include: findVideoIncludeConfig,
        orderBy: {
          updatedAt: 'desc',
        },
      });
      return videos;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async create(dto: CreateUserDto) {
    try {
      const user = await this.dbService.user.create({ data: dto });
      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async activateUser(id: string) {
    try {
      const user = await this.dbService.user.update({
        where: { id },
        data: { isActivated: true },
      });
      return user;
    } catch (err) {
      return { isActivated: false };
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    const updateDto: UpdateUserDto = {
      ...dto,
    };
    if (dto.password) {
      updateDto.password = bcrypt.hashSync(dto.password, 7);
    }
    try {
      const user = await this.dbService.user.update({
        where: { id },
        data: updateDto,
        include: findUserIncludeConfig,
      });
      return user;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async toggleBanUser(id: string, isBanned: boolean) {
    try {
      const user = await this.dbService.user.update({
        where: { id },
        data: { isBanned },
      });
      return user;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async addVideoToHistory(videoId: string, userId: string) {
    try {
      const history = await this.dbService.history.findFirst({
        where: { videoId, userId },
      });
      if (history) {
        return await this.dbService.history.updateMany({
          where: { videoId, userId },
          data: { updatedAt: new Date() },
        });
      } else {
        return await this.dbService.history.create({
          data: { videoId, userId },
        });
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async toggleChannelSubscribe(
    userId: string,
    channelId: string,
    isSubscribed: boolean,
  ) {
    try {
      const user = await this.dbService.user.update({
        where: { id: userId },
        data: {
          subscribes: isSubscribed
            ? { disconnect: { id: channelId } }
            : { connect: { id: channelId } },
        },
      });
      return user;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: string) {
    try {
      const user = await this.dbService.user.delete({ where: { id } });
      return user;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async scheduledCleanupHistories() {
    try {
      await this.cleanupAllUsersHistories();
    } catch (error) {}
  }

  private async cleanupUserHistories(userId: string) {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    const latestHistories = await this.dbService.history.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 10,
      select: { id: true },
    });

    const keepIds = latestHistories.map((h) => h.id);

    return this.dbService.history.deleteMany({
      where: {
        userId,
        updatedAt: { lt: fiveDaysAgo },
        NOT: { id: { in: keepIds } },
      },
    });
  }

  private async cleanupAllUsersHistories() {
    const usersWithHistory = await this.dbService.history.findMany({
      select: { userId: true },
    });

    for (const { userId } of usersWithHistory) {
      await this.cleanupUserHistories(userId);
    }
  }
}
