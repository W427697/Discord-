import { TELEMETRY_ERROR } from '@storybook/core-events';
import { values } from './globals/runtime';
import { globals } from './globals/types';

const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

// Apply all the globals
getKeys(globals).forEach((key) => {
  (globalThis as any)[globals[key]] = values[key];
});

globalThis.sendTelemetryError = (error) => {
  const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
  channel.emit(TELEMETRY_ERROR, error);
};

// handle all uncaught StorybookError at the root of the application and log to telemetry if applicable
globalThis.addEventListener('error', (args) => {
  const error = args.error || args;
  if (error.fromStorybook && error.telemetry) {
    globalThis.sendTelemetryError(error);
  }
});
globalThis.addEventListener('unhandledrejection', ({ reason }) => {
  if (reason.fromStorybook && reason.telemetry) {
    globalThis.sendTelemetryError(reason);
  }
});
