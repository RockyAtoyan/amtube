import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PlaylistsService } from './playlists.service';
import {
  PlaylistFilterEnum,
  type ToggleSavePlaylistDto,
  type ToggleVideoToPlaylistDto,
} from './playlists.types';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Auth()
  @UseInterceptors(FileInterceptor('thumbnail'))
  @Post()
  create(
    @UploadedFile() thumbnail,
    @Body() createPlaylistDto: CreatePlaylistDto,
    @Req() req,
  ) {
    if (req?.user?.sub !== createPlaylistDto.userId)
      throw new UnauthorizedException();
    return this.playlistsService.create(createPlaylistDto, thumbnail);
  }

  @Get()
  findAll(
    @Query('searchTerm') searchTerm,
    @Query('filter') filter: PlaylistFilterEnum = PlaylistFilterEnum.POPULAR,
    @Query('page') page = '0',
    @Query('limit') limit = '10',
  ) {
    if (isNaN(+page)) throw new NotFoundException();
    return this.playlistsService.findAll(
      searchTerm,
      filter,
      +page,
      isNaN(+limit) ? 10 : +limit,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playlistsService.findOne(id);
  }

  @Auth({ mustHaveAccess: true })
  @Patch('/saved/:id')
  toggleSavePlaylist(
    @Param('id') id: string,
    @Body() dto: ToggleSavePlaylistDto,
  ) {
    return this.playlistsService.toggleSavePlaylist(
      dto.playlistId,
      dto.userId,
      !!dto.isSaved,
    );
  }

  @Auth()
  @Patch('/added/:id')
  toggleVideoToPlaylist(
    @Param('id') id: string,
    @Body() dto: ToggleVideoToPlaylistDto,
  ) {
    return this.playlistsService.toggleVideoToPlaylist(
      dto.playlistId,
      dto.videoId,
      !!dto.isAdded,
    );
  }

  @Auth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlaylistDto: UpdatePlaylistDto,
  ) {
    return this.playlistsService.update(id, updatePlaylistDto);
  }

  @Auth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playlistsService.remove(id);
  }
}
