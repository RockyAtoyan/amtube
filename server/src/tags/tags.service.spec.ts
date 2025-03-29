import { Test, TestingModule } from '@nestjs/testing';
import { DbService } from 'src/db/db.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagsService } from './tags.service';

describe('TagsService', () => {
  let service: TagsService;
  let dbService: DbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbService, TagsService],
    }).compile();

    dbService = module.get<DbService>(DbService);
    service = module.get<TagsService>(TagsService);
    await dbService.resetTestDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be created', async () => {
    const dto: CreateTagDto = { name: 'created-tag' };
    const tag = await service.create(dto);
    console.log(tag);
    expect(tag.name).toEqual(dto.name);
  });
});
