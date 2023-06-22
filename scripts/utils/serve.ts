import { kill as portKiller } from 'cross-port-killer';
import express from 'express';
import serveStatic from 'serve-static';
import type { Server } from 'http';

export const serve = async (location: string, port: string): Promise<Server> => {
  return new Promise((resolve) => {
    const app = express();

    app.use(serveStatic(location));
    const server = app.listen(port, () => {
      resolve(server);
    });
  });
};

// portKiller is not actually async.. it does return a promise, but executes synchronously
export const killPort = async (port: number) => {
  try {
    await portKiller(port);
  } catch (e) {
    // ignore
  }
};
