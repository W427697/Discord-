/* eslint-disable no-underscore-dangle */
import type * as MODULE from '../channel-postmessage';

const { WebsocketTransport, createChannel } = (globalThis as any)
  .__STORYBOOK_MODULE_CHANNEL_POSTMESSAGE__ as typeof MODULE;

export { WebsocketTransport, createChannel };
