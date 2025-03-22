import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelFilter, ChannelFilterEnum } from './channels.types';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelsService.create(createChannelDto);
  }

  @Get()
  findAll(
    @Query('filter') filter: ChannelFilter = ChannelFilterEnum.POPULAR,
    @Query('page') page = '0',
    @Query('limit') limit = '10',
  ) {
    if (isNaN(+page)) throw new NotFoundException();
    return this.channelsService.findAll(
      filter,
      +page,
      isNaN(+limit) ? 10 : +limit,
    );
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.channelsService.findById(id);
  }

  @Get('/slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.channelsService.findBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelsService.update(id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelsService.remove(id);
  }
}
