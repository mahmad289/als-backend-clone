import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { IDocumentUploadService } from 'als/manager/document-upload/document-upload.service';
import { Server } from 'socket.io';

// FIXME: IP WhiteList
@WebSocketGateway({
  path: '/sockets',
  cors: {
    origin: '*',
  },
})
export class NotificationGateway {
  constructor(private inboxService: IDocumentUploadService) {}

  @WebSocketServer()
  server: Server;

  async notifyInboxCount() {
    const count = await this.inboxService.unreadCount();
    this.server.emit('notification/fileUpload', count);
    return;
  }
}
