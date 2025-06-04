import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploadMediaDto {
  @ApiProperty()
  @IsNotEmpty()
  uploadPath: string;

  @ApiProperty()
  @IsNotEmpty()
  filename: string;
}
