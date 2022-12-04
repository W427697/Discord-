import { cache } from '@storybook/core-common';
import type { EventType } from './types';

export const set = async (eventType: EventType, body: any) => {
  const lastEvents = (await cache.get('lastEvents')) || {};
  lastEvents[eventType] = { body, timestamp: Date.now() };
  await cache.set('lastEvents', lastEvents);
};

export const get = async (eventType: EventType) => {
  const lastEvents = await cache.get('lastEvents');
  return lastEvents?.[eventType];
};

const upgradeFields = (event: any) => {
  const { body, timestamp } = event;
  return {
    timestamp,
    eventType: body?.eventType,
    eventId: body?.eventId,
    sessionId: body?.sessionId,
  };
};

export const getPrecedingUpgrade = async (eventType: EventType, events: any = undefined) => {
  const lastEvents = events || (await cache.get('lastEvents'));
  console.log({ lastEvents });
  const init = lastEvents?.init;
  let precedingEvent = init;
  const upgrade = lastEvents?.upgrade;
  if (upgrade && (!precedingEvent || upgrade.timestamp > precedingEvent?.timestamp)) {
    precedingEvent = upgrade;
  }
  const precedingThis = lastEvents?.[eventType];
  if (!precedingThis?.timestamp) return precedingEvent && upgradeFields(precedingEvent);
  if (!precedingEvent?.timestamp) return undefined;
  return precedingEvent?.timestamp > precedingThis.timestamp
    ? upgradeFields(precedingEvent)
    : undefined;
};
