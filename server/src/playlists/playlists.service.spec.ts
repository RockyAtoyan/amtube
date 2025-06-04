import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from 'src/db/db.service';
import { MediaService } from 'src/media/media.service';
import { PlaylistsService } from './playlists.service';

describe('PlaylistsService', () => {
  let service: PlaylistsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaylistsService, DbService, MediaService],
    }).compile();

    service = module.get<PlaylistsService>(PlaylistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
