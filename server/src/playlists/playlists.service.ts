import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { DbService } from './../db/db.service';
import { MediaService } from './../media/media.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PlaylistFilter, PlaylistFilterEnum } from './playlists.types';

@Injectable()
export class PlaylistsService {
  constructor(
    private dbService: DbService,
    private mediaService: MediaService,
  ) {}

  async create(
    createPlaylistDto: CreatePlaylistDto,
    thumbnail?: Express.Multer.File,
  ) {
    try {
      const playlistId = uuid();

      let thumbnailUrl: string | undefined;
      if (thumbnail) {
        thumbnailUrl = await this.mediaService.saveFile(
          thumbnail,
          `playlists-thumbnails`,
          playlistId,
        );
      }

      const playlist = await this.dbService.playlist.create({
        data: {
          ...createPlaylistDto,
          id: playlistId,
          thumbnailUrl,
        },
      });

      return playlist;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findAll(filter: PlaylistFilter, page: number, limit: number) {
    try {
      const options: Prisma.PlaylistFindManyArgs = {
        include: {
          user: true,
          channel: true,
          videos: { include: { channel: true } },
        },
        skip: page * limit,
        take: limit,
      };
      const count = await this.dbService.playlist.count();
      switch (filter) {
        case PlaylistFilterEnum.POPULAR:
          return {
            playlists: await this.dbService.playlist.findMany({
              ...options,
              orderBy: { savings: { _count: 'desc' } },
            }),
            totalCount: count,
          };
          break;
        case PlaylistFilterEnum.NEWEST:
          return {
            playlists: await this.dbService.playlist.findMany({
              ...options,
              orderBy: { createdAt: 'desc' },
            }),
            totalCount: count,
          };
          break;
        case PlaylistFilterEnum.LATEST:
          return {
            playlists: await this.dbService.playlist.findMany({
              ...options,
              orderBy: { createdAt: 'asc' },
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
      const playlist = await this.dbService.playlist.findUnique({
        where: { id },
        include: {
          user: true,
          channel: true,
          videos: { include: { channel: true } },
        },
      });
      return playlist;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async toggleSavePlaylist(
    playlistId: string,
    userId: string,
    isSaved: boolean,
  ) {
    try {
      const playlist = await this.dbService.playlist.update({
        where: { id: playlistId },
        data: {
          savings: !isSaved
            ? { connect: { id: userId } }
            : { disconnect: { id: userId } },
        },
      });
      return playlist;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async toggleVideoToPlaylist(
    playlistId: string,
    videoId: string,
    isAdded: boolean,
  ) {
    try {
      const playlist = await this.dbService.playlist.update({
        where: { id: playlistId },
        data: {
          videos: !isAdded
            ? { connect: { id: videoId } }
            : { disconnect: { id: videoId } },
        },
      });
      return playlist;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async update(id: string, updatePlaylistDto: UpdatePlaylistDto) {
    try {
      const playlist = await this.dbService.playlist.update({
        where: { id },
        data: updatePlaylistDto,
      });
      return playlist;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: string) {
    try {
      const playlist = await this.dbService.playlist.delete({
        where: { id },
      });
      return playlist;
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
