import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (token) {
        const payload = this.jwtService.verify(token);
        this.connectedUsers.set(client.id, payload.sub);
        client.join(`user-${payload.sub}`);
        console.log(`User ${payload.sub} connected`);
      }
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      this.connectedUsers.delete(client.id);
      console.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('join-scam')
  handleJoinScam(
    @MessageBody() scamId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`scam-${scamId}`);
    return { status: 'joined', scamId };
  }

  @SubscribeMessage('leave-scam')
  handleLeaveScam(
    @MessageBody() scamId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`scam-${scamId}`);
    return { status: 'left', scamId };
  }

  // Métodos para emitir eventos
  emitNewScam(scam: any) {
    this.server.emit('new-scam', scam);
  }

  emitNewComment(scamId: string, comment: any) {
    this.server.to(`scam-${scamId}`).emit('new-comment', comment);
  }

  emitNewLike(scamId: string, data: any) {
    this.server.to(`scam-${scamId}`).emit('new-like', data);
  }

  emitScamUpdate(scamId: string, update: any) {
    this.server.to(`scam-${scamId}`).emit('scam-update', update);
  }

  sendNotificationToUser(userId: string, notification: any) {
    this.server.to(`user-${userId}`).emit('notification', notification);
  }
}