import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { VideosController } from './videos.controller';

describe('VideosController', () => {
  let controller: VideosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<VideosController>(VideosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
