import type { EventType, Payload, Options, TelemetryData } from './types';
import { getStorybookMetadata } from './storybook-metadata';
import { sendTelemetry } from './telemetry';
import { notify } from './notify';
import { getProjectRoot } from './anonymous-id';

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
      const cwd = getProjectRoot();
      // make sure to anonymise possible paths from error messages
      telemetryData.payload.error = {
        message: error.message.replaceAll(cwd, 'CWD'),
        stack: error.stack.replaceAll(cwd, 'CWD'),
      };
    }

    await sendTelemetry(telemetryData, options);
  }
};
