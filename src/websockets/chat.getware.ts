import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TokenService } from 'src/shared/services/token.service';
import { roleName } from 'src/shared/constants/role.constant';

@WebSocketGateway({
  namespace: '/payments',
  cors: { origin: true, credentials: true },
})
export class ChatGetware implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly tokenService: TokenService) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    const header = client.handshake.headers.authorization;
    const token =
      client.handshake.auth?.token ??
      (typeof header === 'string' ? header.replace(/^Bearer\s+/i, '') : '');
    try {
      const payload = await this.tokenService.verifyAccessToken(token);
      client.data.user = payload;
      await client.join(`user:${payload.userId}`);
      if (payload.roleName === roleName.Admin) await client.join('admins');
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect(@ConnectedSocket() _client: Socket) {}

  paymentUpdated(event: {
    paymentId: number;
    orderIds: number[];
    userId: number;
    status: string;
  }) {
    this.server.to(`user:${event.userId}`).emit('payment.updated', event);
    this.server.to('admins').emit('payment.updated', event);
  }
}
