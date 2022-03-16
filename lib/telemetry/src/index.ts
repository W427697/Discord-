import type { OperationType, Payload, Options, TelemetryData } from './types';
import { getStorybookMetadata } from './storybook-metadata';
import { sendTelemetry } from './telemetry';
import { notify } from './notify';

export * from './storybook-metadata';

export const telemetry = async (
  operationType: OperationType,
  payload: Payload = {},
  options?: Partial<Options>
) => {
  await notify();
  const telemetryData: TelemetryData = {
    operationType,
    payload,
    inCI: process.env.CI === 'true',
    time: Date.now(),
  };
  try {
    telemetryData.metadata = await getStorybookMetadata(options.configDir);
  } catch (error) {
    telemetryData.payload.error = error;
  } finally {
    await sendTelemetry(telemetryData, options);
  }
};
