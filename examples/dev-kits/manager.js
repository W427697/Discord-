import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';

addons.setConfig({
  theme: themes.dark,
  mapper: ({ id, url }, { kind, ...rest }) => ({
    ...rest,
    kind: `From another external storybook|${kind.replace('|', '/')}`,
  }),
});
