import { Module } from '@nestjs/common';
import { MediaService } from 'src/media/media.service';
import { PlaylistsController } from './playlists.controller';
import { PlaylistsService } from './playlists.service';

@Module({
  controllers: [PlaylistsController],
  providers: [PlaylistsService, MediaService],
})
export class PlaylistsModule {}
