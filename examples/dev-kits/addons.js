import '@storybook/addon-roundtrip/register';
import '@storybook/addon-parameter/register';
import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';

addons.setConfig({
  refs: [
    {
      id: 'inception',
      mapper: ({ kind, ...rest }) => ({
        ...rest,
        kind: `From another external storybook|${kind.replace('|', '/')}`,
      }),
      url: 'https://storybookjs-next.now.sh/dev-kits/iframe.html',
    },
  ],
  theme: themes.dark,
});
