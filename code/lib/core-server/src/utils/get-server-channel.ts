import WebSocket, { WebSocketServer } from 'ws';
import { isJSON, parse, stringify } from 'telejson';
import type { ChannelHandler, ChannelPage } from '@storybook/channels';
import { Channel } from '@storybook/channels';
import { colors, logger } from '@storybook/node-logger';
import { inspect } from 'util';

type Server = NonNullable<NonNullable<ConstructorParameters<typeof WebSocketServer>[0]>['server']>;

/**
 * This class represents a channel transport that allows for a one-to-many relationship between the server and clients.
 * Unlike other channels such as the postmessage and websocket channel implementations, this channel will receive from many clients and any events emitted will be sent out to all connected clients.
 */
export class ServerChannelTransport {
  private page: ChannelPage = 'server';

  private socket: WebSocketServer;

  private handler?: ChannelHandler;

  constructor(server: Server) {
    this.socket = new WebSocketServer({ noServer: true });

    server.on('upgrade', (request, socket, head) => {
      if (request.url === '/storybook-server-channel') {
        this.socket.handleUpgrade(request, socket, head, (ws) => {
          this.socket.emit('connection', ws, request);
        });
      }
    });
    this.socket.on('connection', (wss) => wss.on('message', this.handleEvent.bind(this)));
  }

  setHandler(handler: ChannelHandler) {
    this.handler = handler;
  }

  send(event: any) {
    const data = stringify(event, { maxDepth: 15, allowFunction: false, allowClass: false });

    Array.from(this.socket.clients)
      .filter((c) => c.readyState === WebSocket.OPEN)
      .forEach((client) => client.send(data));
  }

  private handleEvent(raw: WebSocket.RawData) {
    const data = raw.toString();
    const event =
      typeof data === 'string' && isJSON(data)
        ? parse(data, { allowFunction: false, allowClass: false })
        : data;

    const pageString = colors.blue(this.page);
    const eventString = colors.green(event.type);
    const message = `${pageString} received ${eventString} (${data.length})`;
    logger.verbose(`${message} ${event.args.map(inspect).join(' ')}`);

    this.handler?.(event);
  }
}

export function getServerChannel(server: Server) {
  const transports = [new ServerChannelTransport(server)];

  return new Channel({ transports, async: true });
}

// for backwards compatibility
export type ServerChannel = ReturnType<typeof getServerChannel>;
