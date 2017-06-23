import Podda from 'podda';

const themesStore = new Podda({});

/**
 * themesStore - simple podda store with all "build-in" themes (located in modules/theming/themes/*.js)
 * we require them dynamically onLoad
 *
 * this module provides API:
 *
 * - selectTheme(themeName: string) selects the current theme
 *
 * - getTheme(): object returns current theme object
 *
 * - getThemesList(): arrayOf(strings) returns names of loaded themes
 *
 * - setTheme(theme: object) adds new or updates existing theme
 *
 * Usage:
 *
 * We don't store themes data in clientStore directly, we provide getTheme() API instead
 * All containers (modules/ui/containers) passes current theme data to components automatically via `gen_podda_loader`
 * it's available inside (root) components as `this.props.theme`
 *
 */

const reqThemes = require.context('../themes/', true, /.js$/);
reqThemes.keys().forEach((filename) => {
  const theme = reqThemes(filename).default;
  themesStore.set(theme.name, theme);
});



themesStore.registerAPI('keys', (store) => {
  const keys = Object.keys(store.getAll());
  return keys;
});

themesStore.registerAPI('includes', (store, themeName) => {
  if (store.keys().indexOf(themeName) > -1) {
    return true;
  }
  return false;
});

export function updateThemesList(clientStore) {
  const themingOptions = clientStore.get('themingOptions');
  themingOptions.themesList = themesStore.keys();
  clientStore.set('themingOptions', themingOptions);
}

function ensureTheme(currentTheme, themeName) {
  if (themesStore.includes(themeName)) {
    return themeName;
  }
  return currentTheme;
}

function setTheme(theme) {
  const themeName = theme.name = theme.name || 'Theme ' + themesStore.keys.length;
  themesStore.set(themeName, theme);
  return theme;
}

export default {
  selectTheme({ clientStore }, themeName) {
    const uiOptions = clientStore.get('uiOptions');
    uiOptions.currentTheme = ensureTheme(clientStore.get('currentTheme'), themeName);
    clientStore.set('uiOptions', uiOptions);
  },

  getTheme({ clientStore }) {
    var themeName = clientStore.get('uiOptions').currentTheme;
    return themesStore.get(themeName);
  },

  getThemesList({ clientStore }) {
    return clientStore.get('themingOptions').themesList;
  },

  setTheme({ clientStore }, theme) {
    setTheme(theme);
    updateThemesList(clientStore);
  }
};
