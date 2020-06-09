import { baseGenerator, Generator } from '../generator';

const generator: Generator = async (npmOptions, options) => {
  baseGenerator(npmOptions, options, 'svelte', {
    extraPackages: ['svelte', 'svelte-loader'],
  });
};

export default generator;
