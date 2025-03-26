import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from './../db/db.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Injectable()
export class AnswersService {
  constructor(private dbService: DbService) {}

  async create(createAnswerDto: CreateAnswerDto) {
    try {
      const answer = await this.dbService.answer.create({
        data: createAnswerDto,
      });
      return answer;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findAll() {
    try {
      const answers = await this.dbService.answer.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          dislikes: true,
          likes: true,
          user: true,
          to: true,
        },
      });
      return answers;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async findOne(id: string) {
    try {
      const answers = await this.dbService.answer.findUnique({
        where: { id },
        include: {
          dislikes: true,
          likes: true,
          user: true,
          to: true,
        },
      });
      return answers;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async toggleLike(answerId: string, userId: string, isLiked: boolean) {
    try {
      if (isLiked) {
        const answer = await this.dbService.answer.update({
          where: { id: answerId },
          data: {
            dislikes: {
              disconnect: { id: userId },
            },
            likes: {
              connect: { id: userId },
            },
          },
        });
        return answer;
      } else {
        const answer = await this.dbService.answer.update({
          where: { id: answerId },
          data: {
            likes: {
              disconnect: { id: userId },
            },
            dislikes: {
              connect: { id: userId },
            },
          },
        });
        return answer;
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async update(id: string, updateAnswerDto: UpdateAnswerDto) {
    try {
      const answer = await this.dbService.answer.update({
        where: { id },
        data: updateAnswerDto,
      });
      return answer;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: string) {
    try {
      const answer = await this.dbService.answer.delete({
        where: { id },
      });
      return answer;
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
