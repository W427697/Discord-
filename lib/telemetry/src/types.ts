export type EventType = 'start' | 'build' | 'upgrade' | 'init' | 'error-build' | 'error-dev';

export interface Payload {
  [key: string]: any;
}

export interface Options {
  retryDelay: number;
  immediate: boolean;
}
