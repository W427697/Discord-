import { StorybookMetadata } from './storybook-metadata';

export type EventType =
  | 'start'
  | 'build'
  | 'upgrade'
  | 'init'
  | 'error-build'
  | 'error-dev'
  | 'error-metadata';

export interface Payload {
  [key: string]: any;
}

export interface Options {
  retryDelay: number;
  immediate: boolean;
  configDir?: string;
}

export interface TelemetryData {
  inCI?: boolean;
  time?: number;
  event: EventType;
  payload: Payload;
  metadata?: StorybookMetadata;
}
