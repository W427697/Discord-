import { getOptionsOrPrompt } from './utils/options';

const frameworks = ['react'];
const addons = ['a11y', 'storysource'];

getOptionsOrPrompt('yarn example', {
  framework: {
    name: 'Which framework would you like to use?',
    values: frameworks,
    required: true,
  },
  addon: {
    name: 'Which extra addons (beyond the CLI defaults) would you like installed?',
    values: addons,
    multiple: true,
  },
  includeStories: {
    name: "Include Storybook's own stories (only applies if a react-based framework is used)?",
  },
  create: {
    name: 'Create the example from scratch (rather than degitting it)?',
  },
  verdaccio: {
    name: 'Use verdaccio rather than yarn linking stories?',
  },
  start: {
    name: 'Start the example app?',
    inverse: true,
  },
  build: {
    name: 'Build the example app?',
  },
  watch: {
    name: 'Start building used packages in watch mode as well as the example app?',
  },
}).then((r) => console.log(r));
