import { baseGenerator, Generator } from '../generator';

const generator: Generator = async (npmOptions, options) => {
  baseGenerator(npmOptions, options, 'preact');
};

export default generator;
