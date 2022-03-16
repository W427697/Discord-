import { EventType, Payload, Options } from './types';
import { getStorybookMetadata } from './storybook-metadata';
import { sendTelemetry } from './telemetry';
import { notify } from './notify';

export * from './storybook-metadata';

export const telemetry = async (
  eventType: EventType,
  payload: Payload,
  options?: Partial<Options>
) => {
  await notify();

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
