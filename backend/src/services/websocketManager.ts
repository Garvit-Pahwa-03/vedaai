import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';

interface Client {
  ws: WebSocket;
  assignmentId?: string;
}

class WebSocketManager {
  private clients: Map<string, Client> = new Map();
  private wss: WebSocketServer | null = null;

  initialize(server: any) {
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const clientId = Math.random().toString(36).substr(2, 9);
      this.clients.set(clientId, { ws });

      ws.on('message', (data) => {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.type === 'subscribe' && msg.assignmentId) {
            const client = this.clients.get(clientId);
            if (client) client.assignmentId = msg.assignmentId;
          }
        } catch {}
      });

      ws.on('close', () => this.clients.delete(clientId));
      ws.send(JSON.stringify({ type: 'connected', clientId }));
    });
  }

  notifyAssignment(assignmentId: string, payload: object) {
    this.clients.forEach((client) => {
      if (
        client.assignmentId === assignmentId &&
        client.ws.readyState === WebSocket.OPEN
      ) {
        client.ws.send(JSON.stringify({ ...payload, assignmentId }));
      }
    });
  }
}

export const wsManager = new WebSocketManager();