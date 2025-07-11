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
import { CommentsService } from './comments.service';
import { type CommentToggleLikeDto } from './comments.types';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Auth()
  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get('v/:id')
  findAll(@Param('id') id: string) {
    return this.commentsService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Auth({ mustHaveAccess: true })
  @Patch('/likes/:id')
  toggleLike(@Param('id') id: string, @Body() dto: CommentToggleLikeDto) {
    return this.commentsService.toggleLike(
      dto.commentId,
      dto.userId,
      dto.isLiked,
    );
  }

  @Auth({ mustHaveAccess: true })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Auth({ mustHaveAccess: true })
  @Delete(':id')
  remove(@Param('id') id: string, @Query('userId') userId: string) {
    return this.commentsService.remove(id);
  }
}
