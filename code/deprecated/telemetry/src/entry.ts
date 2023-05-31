import { deprecate } from '@storybook/node-logger';

deprecate(
  'importing from @storybook/telemetry is deprecated and will be removed in 8.0, please import telemetry related modules from @storybook/core-api'
);

export * from '@storybook/core-api';
