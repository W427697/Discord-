import '@storybook/addon-roundtrip/register';
import '@storybook/addon-parameter/register';

import { addons } from '@storybook/addons';

addons.setOption({
  refs: {
    FooBar: 'https://storybookjs-next.now.sh/dev-kits/iframe.html',
  },
});
