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
  const init = lastEvents?.init;
  let precedingUpgrade = init;
  const upgrade = lastEvents?.upgrade;
  if (upgrade && (!precedingUpgrade || upgrade.timestamp > precedingUpgrade?.timestamp)) {
    precedingUpgrade = upgrade;
  }
  if (!precedingUpgrade) return undefined;

  const lastEventOfType = lastEvents?.[eventType];
  return !lastEventOfType?.timestamp || precedingUpgrade.timestamp > lastEventOfType.timestamp
    ? upgradeFields(precedingUpgrade)
    : undefined;
};
