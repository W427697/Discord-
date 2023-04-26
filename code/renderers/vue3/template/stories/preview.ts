import type { App, Plugin } from 'vue';
import type { StoryContext } from '@storybook/csf';
import { global as globalThis } from '@storybook/global';
// eslint-disable-next-line import/no-extraneous-dependencies
import { setup, type VueRenderer } from '@storybook/vue3';

declare module 'vue' {
  interface ComponentCustomProperties {
    $greetingMessage: (key: string) => string;
  }
}

declare global {
  // eslint-disable-next-line no-var,vars-on-top
  var Components: Record<string, any>;
}

const somePlugin: Plugin = {
  install: (app: App, options) => {
    // inject a globally available $greetingText() method
    // eslint-disable-next-line no-param-reassign
    app.config.globalProperties.$greetingMessage = (key: string) => {
      // retrieve a nested property in `options`
      // using `key`
      return options.greetings[key];
    };
  },
};
const someColor = 'someColor';

// add components to global scope
setup((app: App) => {
  // This adds a component that can be used globally in stories
  app.component('GlobalButton', globalThis.Components.Button);
});

// this adds a plugin to vue app that can be used globally in stories
setup((app: App, context?: StoryContext<VueRenderer>) => {
  app.use(somePlugin, {
    greetings: {
      hello: `Hello Story! from some plugin your name is ${context?.name}!`,
      welcome: `Welcome Story! from some plugin your name is ${context?.name}!`,
      hi: `Hi Story! from some plugin your name is ${context?.name}!`,
    },
  });
});

// additonal setup to provide some propriety  to the app
setup((app: App, context) => {
  app.provide(someColor, 'green');
});
