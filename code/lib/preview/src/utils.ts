import { global } from '@storybook/global';
import type { BrowserInfo } from 'browser-dtector';
import BrowserDetector from 'browser-dtector';

export function preprocessError(
  error: Error & {
    fromStorybook?: boolean;
    category?: string;
    target?: any;
    currentTarget?: any;
    srcElement?: any;
    browserInfo?: BrowserInfo;
  }
) {
  // eslint-disable-next-line no-param-reassign
  error.browserInfo = new BrowserDetector(global.navigator.userAgent).getBrowserInfo();

  return error;
}
