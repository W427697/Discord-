import { deprecate } from '@storybook/core/dist/modules/client-logger/index';

export * from '@storybook/core/dist/modules/client-logger/index';

deprecate('you imported @storybook/client-logger directly, please import from @storybook/core');
