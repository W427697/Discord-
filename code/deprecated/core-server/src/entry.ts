import { deprecate } from '@storybook/node-logger';

deprecate(
  'importing from @storybook/core-server is deprecated and will be removed in 8.0, please import core related modules from @storybook/core-api'
);

export * from '@storybook/core-api';
