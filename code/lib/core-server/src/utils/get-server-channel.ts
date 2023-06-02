import WebSocket, { WebSocketServer } from 'ws';
import { stringify } from 'telejson';

type Server = ConstructorParameters<typeof WebSocketServer>[0]['server'];

export class ServerChannel {
  webSocketServer: WebSocketServer;

  listeners: Record<string, Function[]>;

  constructor(server: Server) {
    this.webSocketServer = new WebSocketServer({ noServer: true });
    this.listeners = {};

    server.on('upgrade', (request, socket, head) => {
      if (request.url === '/storybook-server-channel') {
        this.webSocketServer.handleUpgrade(request, socket, head, (ws) => {
          this.webSocketServer.emit('connection', ws, request);
        });
      }
    });
    this.webSocketServer.on('connection', (wss) => {
      wss.on('message', (data) => {
        try {
          const { type, args } = JSON.parse(data.toString('utf-8'));
          if (this.listeners) {
            this.listeners[type].forEach((listener) => listener(args));
          }
        } catch (e) {
          //
        }
      });
    });
  }

  on(type: string, callback: any) {
    this.listeners[type] = this.listeners[type] || [];
    this.listeners[type].push(callback);

    return () => {
      this.listeners[type] = this.listeners[type].filter((l) => l !== callback);
    };
  }

  emit(type: string, args: any = []) {
    const event = { type, args };
    const data = stringify(event, { maxDepth: 15, allowFunction: true });
    Array.from(this.webSocketServer.clients)
      .filter((c) => c.readyState === WebSocket.OPEN)
      .forEach((client) => client.send(data));
  }
}

export function getServerChannel(server: Server) {
  return new ServerChannel(server);
}
