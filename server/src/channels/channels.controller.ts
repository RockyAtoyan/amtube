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
  Req,
} from '@nestjs/common';
import { type Request } from 'express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ChannelsService } from './channels.service';
import { type ChannelFilter, ChannelFilterEnum } from './channels.types';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Auth({ mustHaveAccess: true })
  @Post()
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelsService.create(createChannelDto);
  }

  @Get()
  findAll(
    @Query('searchTerm') searchTerm = '',
    @Query('filter') filter: ChannelFilter = ChannelFilterEnum.POPULAR,
    @Query('page') page = '0',
    @Query('limit') limit = '10',
    @Query('pagination') pagination,
  ) {
    if (isNaN(+page)) throw new NotFoundException();

    return this.channelsService.findAll(
      searchTerm,
      filter,
      +page,
      isNaN(+limit) ? 10 : +limit,
      pagination == 'true',
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

  @Auth({ mustHaveAccess: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelsService.update(id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.channelsService.remove(id, req);
  }
}
