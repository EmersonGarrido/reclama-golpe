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
import { UseGuards, Logger } from '@nestjs/common';
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

  private readonly logger = new Logger('WebSocketGateway');
  private connectedUsers = new Map<string, string>();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      // Token é OBRIGATÓRIO
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        this.logger.warn('WebSocket connection rejected: No token provided');
        client.emit('error', { message: 'Authentication required' });
        client.disconnect();
        return;
      }

      // Verificar e validar o token
      const payload = this.jwtService.verify(token);
      
      if (!payload || !payload.sub) {
        this.logger.warn('WebSocket connection rejected: Invalid token payload');
        client.emit('error', { message: 'Invalid authentication' });
        client.disconnect();
        return;
      }

      // Armazenar informações do usuário autenticado
      this.connectedUsers.set(client.id, payload.sub);
      client.data.userId = payload.sub;
      client.data.isAdmin = payload.isAdmin || false;
      
      // Adicionar ao room do usuário
      client.join(`user-${payload.sub}`);
      
      this.logger.log(`User ${payload.sub} connected (Admin: ${payload.isAdmin})`);
      client.emit('connected', { userId: payload.sub });
      
    } catch (error) {
      this.logger.error('WebSocket connection rejected:', error.message);
      client.emit('error', { message: 'Authentication failed' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      this.connectedUsers.delete(client.id);
      this.logger.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('join-scam')
  handleJoinScam(
    @MessageBody() scamId: string,
    @ConnectedSocket() client: Socket,
  ) {
    // Verificar se o cliente está autenticado
    if (!client.data.userId) {
      return { error: 'Authentication required' };
    }
    
    client.join(`scam-${scamId}`);
    this.logger.log(`User ${client.data.userId} joined scam-${scamId}`);
    return { status: 'joined', scamId };
  }

  @SubscribeMessage('leave-scam')
  handleLeaveScam(
    @MessageBody() scamId: string,
    @ConnectedSocket() client: Socket,
  ) {
    // Verificar se o cliente está autenticado
    if (!client.data.userId) {
      return { error: 'Authentication required' };
    }
    
    client.leave(`scam-${scamId}`);
    this.logger.log(`User ${client.data.userId} left scam-${scamId}`);
    return { status: 'left', scamId };
  }

  // Método privado para verificar se usuário é admin
  private isAdmin(client: Socket): boolean {
    return client.data.isAdmin === true;
  }

  // Evento para broadcast admin (requer admin)
  @SubscribeMessage('admin-broadcast')
  handleAdminBroadcast(
    @MessageBody() data: { message: string; type: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Verificar se é admin
    if (!this.isAdmin(client)) {
      this.logger.warn(`Non-admin user ${client.data.userId} tried to broadcast`);
      return { error: 'Admin access required' };
    }
    
    // Enviar broadcast para todos
    this.server.emit('admin-message', {
      message: data.message,
      type: data.type,
      timestamp: new Date(),
    });
    
    this.logger.log(`Admin ${client.data.userId} sent broadcast: ${data.message}`);
    return { status: 'broadcast sent' };
  }

  // Métodos para emitir eventos (usados internamente pelo servidor)
  emitNewScam(scam: any) {
    // Apenas emite para usuários autenticados
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
    // Apenas envia para o usuário específico autenticado
    this.server.to(`user-${userId}`).emit('notification', notification);
  }
}