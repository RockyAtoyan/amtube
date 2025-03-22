import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BanUserDto {
  @ApiProperty()
  @IsNotEmpty()
  isBanned: boolean;
}
