import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class AvatarValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!value.mimetype.toLowerCase().startsWith('image/'))
      throw new BadRequestException('Unacceptable file type!');
    return true;
  }
}
