import { global as globalThis } from '@storybook/global';
// eslint-disable-next-line import/no-extraneous-dependencies
import { setup } from '@storybook/vue3';
import type { App, Plugin } from 'vue';

const i18nPlugin: Plugin = {
  install: (app: App, options) => {
    // inject a globally available $translate() method
    // eslint-disable-next-line no-param-reassign
    app.config.globalProperties.$translate = (key: string) => {
      // retrieve a nested property in `options`
      // using `key` as the path
      return key.split('.').reduce((o: { [x: string]: any }, i: string | number) => {
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
      hello: 'Bonjour!',
    },
  });
});

// additonal setup to provide selected language to the app
setup((app, context) => {
  app.provide(themeColor, 'green');
});
