/* eslint-disable no-underscore-dangle */
import type * as MODULE from '../channel-postmessage';

const { KEY, PostmsgTransport, createChannel } = (globalThis as any)
  .__STORYBOOK_MODULE_CHANNEL_POSTMESSAGE__ as typeof MODULE;

export { KEY, PostmsgTransport, createChannel };
