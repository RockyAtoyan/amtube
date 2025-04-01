import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsService } from './channels.service';
import { DbService } from 'src/db/db.service'

describe('ChannelsService', () => {
  let service: ChannelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelsService, DbService],
    }).compile();

    service = module.get<ChannelsService>(ChannelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
