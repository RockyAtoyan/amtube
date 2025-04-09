import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UploadMediaDto } from './dto/upload-media.dto';
import { MediaService } from './media.service';

@Auth()
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Auth()
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  saveFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadMediaDto,
  ) {
    return this.mediaService.saveFile(file, dto.uploadPath, dto.filename);
  }
}
