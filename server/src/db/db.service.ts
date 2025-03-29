import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DbService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async resetTestDatabase() {
    if (process.env.NODE_ENV !== 'test') return;

    const models = Reflect.ownKeys(this).filter(
      (key) => key[0] !== '_' && key[0] !== '$',
    );

    await Promise.all(
      models.map(
        (modelKey) => this[modelKey]?.deleteMany && this[modelKey].deleteMany(),
      ),
    );
  }
}
