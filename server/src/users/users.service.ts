import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from './../db/db.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private dbService: DbService) {}

  async findById(id: string) {
    const user = await this.dbService.user.findUnique({ where: { id } });
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    const user = await this.dbService.user.findUnique({ where: { email } });
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }

  async findByName(name: string) {
    const user = await this.dbService.user.findUnique({ where: { name } });
    if (!user) return null;
    const { password, ...result } = user;
    return result;
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
    try {
      const user = await this.dbService.user.update({
        where: { id },
        data: dto,
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
      const history = await this.dbService.history.create({
        data: { videoId, userId },
      });
      return history;
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

  async delete(id: string) {
    try {
      const user = await this.dbService.user.delete({ where: { id } });
      return user;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
