import baseGenerator, { Generator } from '../generator';

const generator: Generator = async (npmOptions, options) => {
  await baseGenerator(npmOptions, options, 'marko');
};

export default generator;
