import * as EVENTS from '@storybook/core-events';

import type { ChannelPage } from './types';

export function formatChannelPage(page: ChannelPage) {
  if (page === 'manager') return `<span style="color: #37D5D3; background: black"> manager </span>`;
  if (page === 'preview') return `<span style="color: #1EA7FD; background: black"> preview </span>`;

  throw new Error(`Unknown page type '${page}'`);
}

export function formatEventType(type: any) {
  return Object.values(EVENTS).includes(type)
    ? `<span style="color: #FF4785">${type}</span>`
    : `<span style="color: #FFAE00">${type}</span>`;
}
