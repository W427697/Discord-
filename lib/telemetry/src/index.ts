import type { EventType, Payload, Options, TelemetryData } from './types';
import { getStorybookMetadata } from './storybook-metadata';
import { sendTelemetry } from './telemetry';
import { notify } from './notify';

export * from './storybook-metadata';

export const telemetry = async (
  eventType: EventType,
  payload: Payload = {},
  options?: Partial<Options>
) => {
  await notify();
  const telemetryData: TelemetryData = {
    eventType,
    payload,
    inCI: process.env.CI === 'true',
    time: Date.now(),
  };
  try {
    telemetryData.metadata = await getStorybookMetadata(options.configDir);
  } catch (error) {
    if (!telemetryData.payload.error) telemetryData.payload.error = error;
  } finally {
    const { error } = telemetryData.payload;
    if (error) {
      telemetryData.payload.error = { message: error.message, stack: error.stack };
    }
    await sendTelemetry(telemetryData, options);
  }
};
