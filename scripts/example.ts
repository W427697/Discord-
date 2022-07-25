import { getOptionsOrPrompt } from './utils/options';

const frameworks = ['react'];
const addons = ['a11y', 'storysource'];

getOptionsOrPrompt('yarn example', {
  framework: {
    flags: '-f, --framework <framework>',
    name: 'Which framework would you like to use?',
    values: frameworks,
    required: true,
  },
  addon: {
    flags: '-a, --addon <addon>',
    name: 'Which extra addons (beyond the CLI defaults) would you like installed?',
    values: addons,
    multiple: true,
  },
  includeStories: {
    flags: '-i, --include-stories',
    name: "Include Storybook's own stories (only applies if a react-based framework is used)?",
  },
  create: {
    flags: '-c, --create',
    name: 'Create the example from scratch (rather than degitting it)?',
  },
  verdaccio: {
    flags: '-v, --verdaccio',
    name: 'Use verdaccio rather than yarn linking stories?',
  },
  start: {
    flags: '-S, --no-start',
    name: "Don't start the example app?",
  },
  build: {
    flags: '-b, --build',
    name: 'Build the example app?',
  },
  watch: {
    flags: '-w, --watch',
    name: 'Start building used packages in watch mode as well as the example app?',
  },
}).then((r) => console.log(r));
