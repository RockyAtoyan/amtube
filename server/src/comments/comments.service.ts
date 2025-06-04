import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from './../db/db.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private dbService: DbService) {}

  async create(createCommentDto: CreateCommentDto) {
    try {
      const comment = await this.dbService.comment.create({
        data: createCommentDto,
        include: {
          video: true
        }
      });
      return comment;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findAll(videoId: string) {
    try {
      const comments = await this.dbService.comment.findMany({
        where: {
          videoId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          answers: {
            include: {
              dislikes: true,
              likes: true,
              user: true,
              to: true,
            },
          },
          dislikes: true,
          likes: true,
          user: true,
        },
      });
      return comments;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async findOne(id: string) {
    try {
      const comments = await this.dbService.comment.findUnique({
        where: { id },
        include: {
          answers: {
            include: {
              dislikes: true,
              likes: true,
              user: true,
              to: true,
            },
          },
          dislikes: true,
          likes: true,
          user: true,
        },
      });
      return comments;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async toggleLike(commentId: string, userId: string, isLiked: boolean) {
    try {
      if (isLiked) {
        const comment = await this.dbService.comment.update({
          where: { id: commentId },
          data: {
            dislikes: {
              disconnect: { id: userId },
            },
            likes: {
              connect: { id: userId },
            },
          },
        });
        return comment;
      } else {
        const comment = await this.dbService.comment.update({
          where: { id: commentId },
          data: {
            likes: {
              disconnect: { id: userId },
            },
            dislikes: {
              connect: { id: userId },
            },
          },
        });
        return comment;
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    try {
      const comment = await this.dbService.comment.update({
        where: { id },
        data: updateCommentDto,
        include: {
          video: true
        }
      });
      return comment;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: string) {
    try {
      const comment = await this.dbService.comment.delete({
        where: { id },
        include: {
          video: true
        }
      });
      return comment;
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
