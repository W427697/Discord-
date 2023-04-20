import type { StoryContext } from '@storybook/csf';
import { global as globalThis } from '@storybook/global';
// eslint-disable-next-line import/no-extraneous-dependencies
import { setup } from '@storybook/vue3';
import type { VueRenderer } from 'renderers/vue3/src/types';
import type { App, Plugin } from 'vue';

declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string;
  }
}

declare global {
  // eslint-disable-next-line no-var,vars-on-top
  var Components: Record<string, any>;
}

const somePlugin: Plugin = {
  install: (app: App, options) => {
    // inject a globally available $translate() method
    // eslint-disable-next-line no-param-reassign
    app.config.globalProperties.$translate = (key: string) => {
      // retrieve a nested property in `options`
      // using `key` as the path
      // eslint-disable-next-line array-callback-return, consistent-return
      return key.split('.').reduce((o, i) => {
        if (o) return o[i];
      }, options);
    };
  },
};
const someColor = 'primaryColor';

// add components to global scope
setup((app: App) => {
  // This adds a component that can be used globally in stories
  app.component('GlobalButton', globalThis.Components.Button);
});

// this adds a plugin to vue app
setup((app: App, context?: StoryContext<VueRenderer>) => {
  app.use(somePlugin, {
    greetings: {
      hello: `Hello Story! from some plugin your name is ${context?.name}!`,
    },
  });
});

// additonal setup to provide selected language to the app
setup((app: App, context) => {
  app.provide(someColor, 'green');
});
