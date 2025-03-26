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
import { VideoFilter, VideoFilterEnum } from './videos.types';

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

  @Get()
  findAll(
    @Query('searchTerm') searchTerm,
    @Query('filter') filter: VideoFilter = VideoFilterEnum.POPULAR,
    @Query('page') page = '0',
    @Query('limit') limit = '10',
  ) {
    if (isNaN(+page)) throw new NotFoundException();
    return this.videosService.findAll(
      searchTerm,
      filter,
      +page,
      isNaN(+limit) ? 10 : +limit,
    );
  }

  @Get('/trending')
  getTrending(@Query('page') page = '0', @Query('limit') limit = '10') {
    if (isNaN(+page)) throw new NotFoundException();
    return this.videosService.getTrendings(+page, +limit);
  }

  @Get('/explore')
  getExplore(@Req() req) {
    const userId = req?.user?.sub;
    if (userId) return this.videosService.getPersonalizedExplore(userId);
    return this.videosService.getGeneralExplore();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(id);
  }

  @Auth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videosService.update(id, updateVideoDto);
  }

  @Auth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videosService.remove(id);
  }
}
