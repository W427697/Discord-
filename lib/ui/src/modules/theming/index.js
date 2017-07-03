import actions from './actions';
import initThemes from './configs/init_themes';

export default {
  actions,
  defaultState: {
    themingOptions: {
      themesList: [],
    },
    /**
     * Also theming module depends on defaultState.uiOptions.currentTheme = 'default'
     * see src/modules/api/index.js
     */
  },
  load({ clientStore }, _actions) {
    initThemes(clientStore, _actions);

    /**
     * Debug:
     * uncomment the line below to get access to API via browser console
     */
    // console.log('UI API:', _actions);
    /**
     * right click on 'UI API:' and 'Store as GlobalVariable'
     * api = temp1;
     * api.theming.getTheme();
     * api.theming.selectTheme('dark');
     * newTheme = api.theming.getTheme();
     * newTheme.name = 'new';
     * api.theming.setTheme(newTheme);
     * api.theming.getThemesList();
     * api.theming.selectTheme('new');
     * newTheme.palette.canvas = 'green';
     * newTheme.palette.background = 'darkgreen';
     * 
     */
  },
};
