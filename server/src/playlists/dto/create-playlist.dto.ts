import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreatePlaylistDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(80)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  channelId: string;
}
