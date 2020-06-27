import EVENTS from '@storybook/core-events';
import { EventMap, EventValue, ObjType } from './types';

export const trackedEvents = (events: EventMap, api: any) => (
  key: EVENTS,
  params: ObjType = {}
): boolean => {
  const event: EventValue = events[key] as EventValue;

  return typeof event === 'function' ? event({ api, ...params }) : event;
};
