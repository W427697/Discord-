import baseGenerator, { Generator } from '../generator';

const generator: Generator = async (npmOptions, options) => {
  baseGenerator(npmOptions, options, 'web-components', {
    dirname: __dirname,
    extraPackages: ['lit-html'],
  });
};

export default generator;
