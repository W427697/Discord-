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
  sendTelemetry(
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

  // I want to be able to await, to ensure all fetch request have been sent before continuing
  // this is important when reporting an error because the next call will be process.exit(), which would kill the process
};
