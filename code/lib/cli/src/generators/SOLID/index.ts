import { baseGenerator } from '../baseGenerator';
import type { Generator } from '../types';

const generator: Generator = async (packageManager, npmOptions, options) => {
  await baseGenerator(
    packageManager,
    npmOptions,
    options,
    'solid',
    { extraAddons: ['@storybook/testing-library'] },
    'solid'
  );
};

export default generator;
