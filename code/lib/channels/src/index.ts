import { Channel } from './main';

export * from './main';

export default Channel;

export { createChannel as createPostMessageChannel } from './postmessage';
export { createChannel as createWebSocketChannel } from './websocket';
