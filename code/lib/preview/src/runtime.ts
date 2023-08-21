import { TELEMETRY_ERROR } from '@storybook/core-events';
import { global } from '@storybook/global';

import { values } from './globals/runtime';
import { globals } from './globals/types';

const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

// Apply all the globals
getKeys(globals).forEach((key) => {
  (globalThis as any)[globals[key]] = values[key];
});

global.sendTelemetryError = (error) => {
  const channel = global.__STORYBOOK_ADDONS_CHANNEL__;
  channel.emit(TELEMETRY_ERROR, error);
};

// handle all uncaught StorybookError at the root of the application and log to telemetry if applicable
global.addEventListener('error', (args) => {
  const error = args.error || args;
  if (error.fromStorybook) {
    global.sendTelemetryError(error);
  }
});
global.addEventListener('unhandledrejection', ({ reason }) => {
  if (reason.fromStorybook) {
    global.sendTelemetryError(reason);
  }
});
