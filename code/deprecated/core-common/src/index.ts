import { deprecate } from '@storybook/core/dist/modules/node-logger/index';

export * from '@storybook/core/dist/modules/core-common/index';

deprecate('you imported @storybook/core-common directly, please import from @storybook/core');
