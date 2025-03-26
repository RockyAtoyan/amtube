import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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

  sendNotificationToUser(userId: string, notification: any) {
    const userRoom = this.getRoomName(userId);
    this.server.to(userRoom).emit('message', notification);
  }

  sendNotificationToUsers(userIds: string[], notification: any) {
    userIds.forEach((userId) => {
      const userRoom = this.getRoomName(userId);
      this.server.to(userRoom).emit('message', notification);
    });
  }

  private getRoomName(userId: string) {
    return `user_${userId}`;
  }
}
