import ip from 'ip';
import { EventType, Payload, Options } from './types';
import { getStorybookMetadata } from './storybook-metadata';
import { sendTelemetry } from './telemetry';
import { oneWayHash } from './oneWayHash';

export * from './storybook-metadata';

export const telemetry = async (
  eventType: EventType,
  payload: Payload,
  options?: Partial<Options>
) => {
  return sendTelemetry(
    {
      operationType: eventType,
      inCI: process.env.CI === 'true',
      time: Date.now(),
      ip: oneWayHash(ip.address()),
      metadata: getStorybookMetadata(),
      payload,
    },
    options
  );
};
