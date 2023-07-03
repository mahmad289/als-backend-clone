import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

// FIXME: IP WhiteList
@WebSocketGateway({
  path: '/sockets',
  cors: {
    origin: '*',
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  notifyOfOcrResult(payload: {
    compliance_id: string;
    client_id: string;
    project_id: string;
    vendor_id: string;
  }) {
    this.server.emit('notification/ocrResult', payload);
    return;
  }
}
