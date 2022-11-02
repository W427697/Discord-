/* eslint-disable no-underscore-dangle */
import type * as MODULE from '../channel-websocket';

const { WebsocketTransport, createChannel } = (globalThis as any)
  .__STORYBOOK_MODULE_CHANNEL_WEBSOCKET__ as typeof MODULE;

export { WebsocketTransport, createChannel };
