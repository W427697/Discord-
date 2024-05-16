import { baseGenerator } from '../baseGenerator';
import type { Generator } from '../types';

const generator: Generator = async (packageManager, npmOptions, options) => {
  await baseGenerator(packageManager, npmOptions, options, 'svelte', {
    extensions: ['js', 'ts', 'svelte'],
    extraAddons: ['@storybook/addon-svelte-csf@4.1.3--canary.182.e67e32d.0'],
  });
};

export default generator;
