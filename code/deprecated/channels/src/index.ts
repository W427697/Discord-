import { deprecate } from '@storybook/core/dist/modules/client-logger/index';

export * from '@storybook/core/dist/modules/channels/index';

deprecate('you imported @storybook/channels directly, please import from @storybook/core');
