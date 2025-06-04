import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
import { CreateVideoDto } from './create-video.dto';

export class UpdateVideoDto extends PartialType(CreateVideoDto) {
  @ApiProperty()
  thumbnailUrl?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiProperty()
  @IsOptional()
  isDeletingThumbnail?: boolean
}
