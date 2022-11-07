import { action } from '@storybook/addon-actions';
import { BunnyDemo, BunnyDemoOptions } from './BunnyDemo';

export default {
  title: 'Demos-Basic',
  args: {
    bunnySize: 5,
    bunnySpacing: 40,
    someInjectedObject: {
      onBunnyClick: action('onBunnyClick'),
    },
  },
};

export const Default = (args: BunnyDemoOptions) => {
  return new BunnyDemo(args);
};
