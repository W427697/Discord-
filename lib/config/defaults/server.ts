import { Server } from '../src/types/values';

export const server: Server = {
  port: 5000,
  devPorts: {
    manager: 55550,
    preview: 55551,
  },
  host: 'localhost',
  middleware: [],
  static: [],
};
