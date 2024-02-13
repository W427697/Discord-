import { addons, types } from '@storybook/core/dist/modules/manager-api/index';

import { ADDON_ID, PARAM_KEY, THEME_SWITCHER_ID } from './constants';
import { ThemeSwitcher } from './theme-switcher';

addons.register(ADDON_ID, () => {
  addons.add(THEME_SWITCHER_ID, {
    title: 'Themes',
    type: types.TOOL,
    match: ({ viewMode, tabId }) => !!(viewMode && viewMode.match(/^(story|docs)$/)) && !tabId,
    render: ThemeSwitcher,
    paramKey: PARAM_KEY,
  });
});
