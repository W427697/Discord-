export type ChannelBrowserPage = 'manager' | 'preview';
export type ChannelPage = ChannelBrowserPage | 'server';

export interface Config {
  page: ChannelBrowserPage;
}

export interface BufferedEvent {
  event: ChannelEvent;
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}

export type ChannelHandler = (event: ChannelEvent) => void;

export interface ChannelTransport {
  send(event: ChannelEvent, options?: any): void;
  setHandler(handler: ChannelHandler): void;
}

export interface ChannelEvent {
  type: string; // eventName
  from: string;
  args: any[];
}

export interface Listener {
  (...args: any[]): void;
}

export interface EventsKeyValue {
  [key: string]: Listener[];
}

export type ChannelArgs = ChannelArgsSingle | ChannelArgsMulti;
export interface ChannelArgsSingle {
  transport?: ChannelTransport;
  async?: boolean;
}
export interface ChannelArgsMulti {
  transports: ChannelTransport[];
  async?: boolean;
}
