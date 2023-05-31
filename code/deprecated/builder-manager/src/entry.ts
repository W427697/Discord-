import { deprecate } from '@storybook/node-logger';

deprecate(
  'importing from @storybook/builder-manager is deprecated and will be removed in 8.0, please import core related modules from @storybook/core-api'
);

// eslint-disable-next-line import/export
export * from '@storybook/core-api/dist/builder';
