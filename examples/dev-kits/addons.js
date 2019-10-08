import '@storybook/addon-roundtrip/register';
import '@storybook/addon-parameter/register';
import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';

addons.setConfig({
  refs: [
    {
      title: 'Inception',
      id: 'foo-bar',
      key: 'FOOBAR',
      mapper: name =>
        name.match(/\||\//)
          ? `From another external storybook|${name.replace('|', '/')}`
          : `inception_${name}`,
      url: 'https://storybookjs-next.now.sh/dev-kits/iframe.html',
    },
  ],
  theme: themes.dark,
});
