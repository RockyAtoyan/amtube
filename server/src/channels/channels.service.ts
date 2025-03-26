import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { DbService } from './../db/db.service';
import { ChannelFilter, ChannelFilterEnum } from './channels.types';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelsService {
  constructor(private dbService: DbService) {}

  async create(createChannelDto: CreateChannelDto) {
    try {
      const channel = await this.dbService.channel.create({
        data: createChannelDto,
      });
      return channel;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findAll(
    searchTerm: string,
    filter: ChannelFilter,
    page: number,
    limit: number,
  ) {
    try {
      const options: Prisma.ChannelFindManyArgs = {
        where: {
          title: {
            contains: searchTerm,
            mode: 'insensitive',
          },
          description: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        include: { user: true, subscribers: true },
        skip: page * limit,
        take: limit,
      };
      const count = await this.dbService.channel.count();
      switch (filter) {
        case ChannelFilterEnum.POPULAR:
          return {
            channels: await this.dbService.channel.findMany({
              ...options,
              orderBy: { subscribers: { _count: 'desc' } },
            }),
            totalCount: count,
          };
          break;
        case ChannelFilterEnum.ALPHABET:
          return {
            channels: await this.dbService.channel.findMany({
              ...options,
              orderBy: { title: 'asc' },
            }),
            totalCount: count,
          };
          break;
        case ChannelFilterEnum.ALPHABET_DESC:
          return {
            channels: await this.dbService.channel.findMany({
              ...options,
              orderBy: { title: 'desc' },
            }),
            totalCount: count,
          };
          break;
        default:
          throw 'error';
          break;
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  findById(id: string) {
    return this.dbService.channel.findUnique({
      where: { id },
      include: { user: true, playlists: true, subscribers: true, videos: true },
    });
  }

  findBySlug(slug: string) {
    return this.dbService.channel.findUnique({
      where: { slug },
      include: { user: true, playlists: true, subscribers: true, videos: true },
    });
  }

  async update(id: string, updateChannelDto: UpdateChannelDto) {
    try {
      const channel = await this.dbService.channel.update({
        where: { id },
        data: updateChannelDto,
      });
      return channel;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: string, req: Request) {
    //@ts-ignore
    const userId = req?.user?.sub;
    if (!userId) throw new BadRequestException();
    try {
      const channel = await this.dbService.channel.delete({
        where: { userId },
      });
      return channel;
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
