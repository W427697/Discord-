import { withKnobsOptions } from '@storybook/addon-knobs';
import { addDecorator } from '@storybook/react-native';

addDecorator(
  withKnobsOptions({
    debounce: { wait: 200, leading: true },
    timestamps: true,
  })
);
