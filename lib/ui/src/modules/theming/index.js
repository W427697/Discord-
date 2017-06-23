import actions from './actions';
import init_themes from './configs/init_themes';

export default {
  actions,
  defaultState: {
    themingOptions: {
      themesList: [],
    },
  },
  load({clientStore}, _actions) {
    init_themes(clientStore, _actions);
  }
};

/**
 * todo:
 * [] check and provide the list of availible themes. getThemes() => [ 'themeNames' ]
 * (init in module.load)
 * [] provide current theme data. getTheme() => { themeData }
 * [] action to switch theme. setTheme(themeName)
 * [] provide the way for themes live development
 *
 * store current theme name in the clientStore.
 * find the minamalistic way to provide actual theme data to components
 *
 * no answer:
 * [] where to store themes
 * [] how to add themes
 *
 */
