import { inject } from 'vue';
import GlobalUsage from './GlobalUsage.vue';
import GlobalSetup from './GlobalSetup.vue';

export default {
  component: GlobalSetup,
  argTypes: {},
  render: (args) => ({
    // Components used in your story `template` are defined in the `components` object
    components: { GlobalSetup },
    // The story's `args` need to be mapped into the template through the `setup()` method
    setup() {
      const themeColor = inject('themeColor', 'red'); // <-- this is the global setup from .storybook/preview.ts
      return { args: { ...args, backgroundColor: themeColor } };
    },
    // And then the `args` are bound to your component with `v-bind="args"`
    template: `<global-setup v-bind="args" />`,
  }),
};

export const Primary = {
  args: {
    primary: true,
    label: 'Global Setup',
  },
};

export const Secondary = {
  args: {
    label: 'Global Setup',
  },
};
