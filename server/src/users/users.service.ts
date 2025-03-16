import { Injectable } from '@nestjs/common';
import { DbService } from './../db/db.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private dbService: DbService) {}

  async findById(id: string) {
    const user = await this.dbService.user.findUnique({ where: { id } });
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }

  async findByEmail(email: string) {
    const user = await this.dbService.user.findUnique({ where: { email } });
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }

  async findByName(name: string) {
    const user = await this.dbService.user.findUnique({ where: { name } });
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }

  async create(dto: CreateUserDto) {
    const user = await this.dbService.user.create({ data: dto });
    const { password, ...result } = user;
    return result;
  }
}
