import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { CreateVideoDto } from './create-video.dto';

export class UpdateVideoDto extends PartialType(CreateVideoDto) {
  @ApiProperty()
  thumbnailUrl?: string;

  @ApiProperty()
  @IsArray()
  tags?: string[];
}
