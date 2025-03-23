import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { Queue } from 'bullmq';
import { VIDEO_QUEUE_NAME } from 'src/configs/bullmq.config';
import { DbService } from './../db/db.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { ProcessVideoJobPayload } from './videos.types';

@Injectable()
export class VideosService {
  constructor(
    @InjectQueue(VIDEO_QUEUE_NAME) private videoQueue: Queue,
    private dbService: DbService,
  ) {}

  async processVideoFile(file: Express.Multer.File, dto: CreateVideoDto) {
    try {
      const { userId, ...createDto } = dto;
      const video = await this.dbService.video.create({
        data: { ...createDto, publicId: createId(), videoSrc: '' },
      });
      const jobPayload: ProcessVideoJobPayload = {
        videoFileName: video.publicId,
        videoFile: file,
        videoId: video.id,
      };
      const job = await this.videoQueue.add('process-video', jobPayload);

      return video;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  create(createVideoDto: CreateVideoDto) {
    return 'This action adds a new video';
  }

  findAll() {
    return `This action returns all videos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} video`;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
