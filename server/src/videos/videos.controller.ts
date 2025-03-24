import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  Sse,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideosService } from './videos.service';
import { ClientEvent, VideosSseService } from './videos.sse';

@Controller('videos')
export class VideosController {
  constructor(
    private videosService: VideosService,
    private videosSseService: VideosSseService,
  ) {}

  @Auth()
  @Post('/process')
  @UseInterceptors(FileInterceptor('file'))
  processVideoFile(
    @UploadedFile() file,
    @Body() processVideoDto: CreateVideoDto,
    @Req() req,
  ) {
    const userId = req?.user?.sub;
    if (!userId) throw new UnauthorizedException();

    return this.videosService.processVideoFile(file, processVideoDto, userId);
  }

  @Auth()
  @Get('/stream-notifications')
  @Sse()
  sse(@Req() req, @Res() res: Response): Observable<ClientEvent> {
    const userId = req?.user?.sub;
    if (!userId) throw new UnauthorizedException();

    return this.videosSseService.addClient(userId);
  }

  @Post()
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videosService.create(createVideoDto);
  }

  @Get()
  findAll() {
    return this.videosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videosService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videosService.remove(+id);
  }
}
