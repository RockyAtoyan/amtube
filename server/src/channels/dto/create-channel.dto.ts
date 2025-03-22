import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateChannelDto {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  slug: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(300)
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  userId: string;
}
