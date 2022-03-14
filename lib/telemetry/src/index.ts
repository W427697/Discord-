import { EventType, Payload, Options } from './types';
import { getStorybookMetadata } from './storybook-metadata';
import { sendTelemetry } from './telemetry';

export * from './storybook-metadata';

export const telemetry = async (
  eventType: EventType,
  payload: Payload,
  options?: Partial<Options>
) => {
  const metadata = await getStorybookMetadata();
  return sendTelemetry(
    {
      operationType: eventType,
      inCI: process.env.CI === 'true',
      time: Date.now(),
      metadata,
      payload,
    },
    options
  );
};
