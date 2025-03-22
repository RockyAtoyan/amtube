import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AddVideoToHistoryDto } from './dto/add-video-to-history.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ToggleChannelSubscribeDto } from './dto/toggle-channel-subscribe';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get('/email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get('/name/:name')
  findBySlug(@Param('name') name: string) {
    return this.usersService.findByName(name);
  }

  @Auth({ mustHaveAccess: true })
  @Patch('')
  update(@Query('userId') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Auth({ roles: ['ADMIN'] })
  @Patch('/ban/:id')
  banUser(@Param('id') id: string, @Body() banUserDto: BanUserDto) {
    return this.usersService.toggleBanUser(id, banUserDto.isBanned);
  }

  @Auth({ mustHaveAccess: true })
  @Patch('/add-video-to-history')
  addVideoToHistory(@Body() addVideoToHistoryDto: AddVideoToHistoryDto) {
    const { videoId, userId } = addVideoToHistoryDto;
    return this.usersService.addVideoToHistory(videoId, userId);
  }

  @Auth({ mustHaveAccess: true })
  @Patch('/toggle-channel-subscribe')
  toggleChannelSubscribe(
    @Body() toggleChannelSubscribeDto: ToggleChannelSubscribeDto,
  ) {
    const { channelId, userId, isSubscribed } = toggleChannelSubscribeDto;
    return this.usersService.toggleChannelSubscribe(
      userId,
      channelId,
      isSubscribed,
    );
  }

  @Auth({ mustHaveAccess: true })
  @Delete('/delete')
  remove(@Query('userId') id: string) {
    return this.usersService.remove(id);
  }
}
