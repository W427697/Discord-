import { TELEMETRY_ERROR } from '../events';
import { globalPackages, globalsNameReferenceMap } from './globals/globals';
import { globalsNameValueMap } from './globals/runtime';

import { global } from '@storybook/global';
import type { BrowserInfo } from 'browser-dtector';
import BrowserDetector from 'browser-dtector';

let browserInfo: BrowserInfo | undefined;

function getBrowserInfo() {
  if (!browserInfo) {
    browserInfo = new BrowserDetector(global.navigator?.userAgent).getBrowserInfo();
  }

  return browserInfo;
}

export function prepareForTelemetry(
  error: Error & {
    fromStorybook?: boolean;
    category?: string;
    target?: any;
    currentTarget?: any;
    srcElement?: any;
    browserInfo?: BrowserInfo;
  }
) {
  error.browserInfo = getBrowserInfo();

  return error;
}

// Apply all the globals
globalPackages.forEach((key) => {
  (global as any)[globalsNameReferenceMap[key]] = globalsNameValueMap[key];
});

global.sendTelemetryError = (error: any) => {
  const channel = global.__STORYBOOK_ADDONS_CHANNEL__;
  channel.emit(TELEMETRY_ERROR, prepareForTelemetry(error));
};

// handle all uncaught StorybookError at the root of the application and log to telemetry if applicable
global.addEventListener('error', (args: any) => {
  const error = args.error || args;
  if (error.fromStorybook) {
    global.sendTelemetryError(error);
  }
});
global.addEventListener('unhandledrejection', ({ reason }: any) => {
  if (reason.fromStorybook) {
    global.sendTelemetryError(reason);
  }
});
