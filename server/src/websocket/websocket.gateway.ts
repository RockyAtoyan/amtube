import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';
import { NotificationsService } from './../notifications/notifications.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/server',
})
export class WebsocketGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>();

  constructor(private notificationsService: NotificationsService) {}

  @SubscribeMessage('connection')
  handleConnection(client: Socket, payload: { userId: string }) {
    try {
      const userId = payload?.userId;
      if (!userId) client.disconnect();
      this.userSockets.set(payload.userId, client.id);
      const room = this.getRoomName(userId);
      client.join(room);
      this.server
        .to(room)
        .emit('connection', { type: 'connection', success: true });
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === socket.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
  }

  async sendNotificationToUser(
    userId: string,
    notification: CreateNotificationDto,
  ) {
    try {
      const not = await this.notificationsService.create(notification);
      const userRoom = this.getRoomName(userId);
      this.server.to(userRoom).emit('message', not);
    } catch (error) {}
  }

  async sendNotificationToUsers(
    userIds: string[],
    notification: Omit<CreateNotificationDto, 'userId'>,
  ) {
    for (const userId of userIds) {
      try {
        const not = await this.notificationsService.create({
          ...notification,
          userId,
        });
        const userRoom = this.getRoomName(userId);
        this.server.to(userRoom).emit('message', not);
      } catch (error) {}
    }
  }

  private getRoomName(userId: string) {
    return `user_${userId}`;
  }
}
