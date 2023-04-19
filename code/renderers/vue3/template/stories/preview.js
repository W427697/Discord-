import { global as globalThis } from '@storybook/global';
// eslint-disable-next-line import/no-extraneous-dependencies
import { setup } from '@storybook/vue3';

const i18nPlugin = {
  install: (app, options) => {
    // inject a globally available $translate() method
    // eslint-disable-next-line no-param-reassign
    app.config.globalProperties.$translate = (key) => {
      // retrieve a nested property in `options`
      // using `key` as the path
      // eslint-disable-next-line array-callback-return, consistent-return
      return key.split('.').reduce((o, i) => {
        if (o) return o[i];
      }, options);
    };
  },
};
const themeColor = 'themeColor';

// add components to global scope
setup((app) => {
  // This adds a component that can be used globally in stories
  app.component('GlobalButton', globalThis.Components.Button);
});

// this adds a plugin to vue app
setup((app, context) => {
  app.use(i18nPlugin, {
    greetings: {
      hello: `Bonjour! from plugin your name is ${context?.name}!`,
    },
  });
});

// additonal setup to provide selected language to the app
setup((app) => {
  app.provide(themeColor, 'green');
});
