import { baseGenerator, Generator } from '../generator';

const generator: Generator = async (npmOptions, options) => {
  baseGenerator(npmOptions, options, 'mithril');
};

export default generator;
