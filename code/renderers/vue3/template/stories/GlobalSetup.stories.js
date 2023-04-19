import { inject } from 'vue';
import GlobalSetup from './GlobalSetup.vue';

export default {
  component: GlobalSetup,
  argTypes: {},
  render: (args) => ({
    // Components used in your story `template` are defined in the `components` object
    components: {  GlobalSetup },
    // The story's `args` need to be mapped into the template through the `setup()` method
    setup() {
      const themeColor = inject('themeColor','blue');
      return { args , themeColor };
    },
    // And then the `args` are bound to your component with `v-bind="args"`
    template: '<global-setup v-bind="args" :backgroundColor="themeColor"  />',
  }),
};

export const Primary = {
  args: {
    primary: true,
    label: 'Theme Color Globally Defined',
  },
};

export const Secondary = {
  args: {
    backgroundColor: 'red',
    label: 'Theme Color Globally Defined',
  },
};
