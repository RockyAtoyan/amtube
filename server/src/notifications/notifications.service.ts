import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from './../db/db.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private dbService: DbService) {}

  async create(createNotificationDto: CreateNotificationDto) {
    try {
      const not = await this.dbService.notification.create({
        data: createNotificationDto,
      });
      return not;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    try {
      const not = await this.dbService.notification.update({
        where: { id },
        data: updateNotificationDto,
      });
      return not;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: string) {
    try {
      const not = await this.dbService.notification.delete({
        where: { id },
      });
      return not;
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
