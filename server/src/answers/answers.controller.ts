import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AnswersService } from './answers.service';
import { AnswerToggleLikeDto } from './answers.types';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Auth()
  @Post()
  create(@Body() createAnswerDto: CreateAnswerDto) {
    return this.answersService.create(createAnswerDto);
  }

  @Get()
  findAll() {
    return this.answersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.answersService.findOne(id);
  }

  @Auth({ mustHaveAccess: true })
  @Patch(':id/likes')
  toggleLike(@Param('id') id: string, @Body() dto: AnswerToggleLikeDto) {
    return this.answersService.toggleLike(
      dto.answerId,
      dto.userId,
      dto.isLiked,
    );
  }

  @Auth({ mustHaveAccess: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnswerDto: UpdateAnswerDto) {
    return this.answersService.update(id, updateAnswerDto);
  }

  @Auth({ mustHaveAccess: true })
  @Delete(':id')
  remove(@Param('id') id: string, @Param('userId') userId: string) {
    return this.answersService.remove(id);
  }
}
