import { baseGenerator, Generator } from '../baseGenerator';

const generator: Generator = async (packageManager, npmOptions, options) => {
  await baseGenerator(packageManager, npmOptions, options, 'svelte', {
    extraPackages: ['@storybook/addon-svelte-csf'],
    extensions: ['js', 'jsx', 'ts', 'tsx', 'svelte'],
    commonJs: true,
  });
};

export default generator;
