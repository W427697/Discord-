import { server as WebSocketServer, connection } from 'websocket';
import { Server } from './http';

export const extend = async (server: Server) => {
  const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true,
  });

  const clients: connection[] = [];
  let lastMessage: string;

  wsServer.on('connect', (c) => {
    clients.push(c);

    c.on('message', (message) => {
      if (message.type === 'utf8') {
        // console.log(`Received Message: ${message.utf8Data}`);
        // c.sendUTF(message.utf8Data);
      } else if (message.type === 'binary') {
        // console.log(`Received Binary Message of ${message.binaryData.length} bytes`);
        // c.sendBytes(message.binaryData);
      }
    });

    c.on('close', () => {
      const index = clients.indexOf(c);
      clients.splice(index, index + 1);
      // console.log(`${new Date()} Peer ${c.remoteAddress} disconnected.`);
    });

    if (lastMessage) {
      c.sendUTF(lastMessage);
    }
  });

  return (message: string) => {
    lastMessage = message;

    clients.forEach((c) => c.sendUTF(message));
  };
};
