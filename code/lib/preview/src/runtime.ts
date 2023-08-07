import { SEND_TELEMETRY_ERROR } from '@storybook/core-events';
import { values } from './globals/runtime';
import { globals } from './globals/types';

const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

// Apply all the globals
getKeys(globals).forEach((key) => {
  (globalThis as any)[globals[key]] = values[key];
});

global.sendTelemetryError = (error) => {
  const channel = global.__STORYBOOK_ADDONS_CHANNEL__;
  channel.emit(SEND_TELEMETRY_ERROR, error);
};

// handle all uncaught StorybookError at the root of the application and log to telemetry if neccesary
global.addEventListener('error', (args) => {
  const error = args.error || args;
  if (error.fromStorybook && error.telemetry) {
    global.sendTelemetryError(error);
  }
});
global.addEventListener('unhandledrejection', ({ reason }) => {
  if (reason.fromStorybook && reason.telemetry) {
    global.sendTelemetryError(reason);
  }
});
