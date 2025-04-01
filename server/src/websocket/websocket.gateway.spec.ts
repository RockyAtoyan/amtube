import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from 'src/notifications/notifications.service';
import { WebsocketGateway } from './websocket.gateway';
import { DbService } from 'src/db/db.service'

describe('WebsocketGateway', () => {
  let gateway: WebsocketGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebsocketGateway, NotificationsService, DbService],
    }).compile();

    gateway = module.get<WebsocketGateway>(WebsocketGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
