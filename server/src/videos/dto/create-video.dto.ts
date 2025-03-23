import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(400)
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  channelId: string;

  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}
