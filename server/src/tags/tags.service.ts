import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DbService } from './../db/db.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private dbService: DbService) {}

  async create(createTagDto: CreateTagDto) {
    try {
      const tag = await this.dbService.tag.create({ data: createTagDto });
      return tag;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findAll(searchTerm: string, page: number, limit: number) {
    try {
      const options: Prisma.TagFindManyArgs = {
        where: {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        include: {
          videos: { include: { channel: true } },
        },
        skip: page * limit,
        take: limit,
      };
      const count = await this.dbService.tag.count();
      return {
        tags: await this.dbService.tag.findMany({
          ...options,
          orderBy: { videos: { _count: 'desc' } },
        }),
        totalCount: count,
      };
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async findOne(id: string) {
    try {
      const tag = await this.dbService.tag.findUnique({
        where: { id },
        include: {
          videos: { include: { channel: true } },
        },
      });
      return tag;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    try {
      const tag = await this.dbService.tag.update({
        where: { id },
        data: updateTagDto,
      });
      return tag;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: string) {
    try {
      const tag = await this.dbService.tag.delete({
        where: { id },
      });
      return tag;
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
