import { baseGenerator } from '../baseGenerator';
import type { Generator } from '../types';

const generator: Generator = async (packageManager, npmOptions, options) => {
  const extraPackages: string[] = [];

  await baseGenerator(packageManager, npmOptions, options, 'react', {
    extraPackages,
    extraAddons: ['@storybook/addon-onboarding'],
  });
};

export default generator;
