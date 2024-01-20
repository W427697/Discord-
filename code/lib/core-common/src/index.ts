import { deprecate } from '@storybook/node-logger';

export * from '@storybook/core/dist/modules/core-common/index';

deprecate('you imported @storybook/core-common directly, please import from @storybook/core');
