import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ToggleChannelSubscribeDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  channelId: string;

  @ApiProperty()
  @IsNotEmpty()
  isSubscribed: boolean;
}
