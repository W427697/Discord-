import { deprecate } from '@storybook/core/dist/modules/client-logger/index';

deprecate(
  "Import from '@storybook/addon-docs/blocks' is deprecated. Please import from '@storybook/blocks' instead."
);

export * from '@storybook/blocks';
