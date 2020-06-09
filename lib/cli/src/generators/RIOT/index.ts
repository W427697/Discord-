import { baseGenerator, Generator } from '../generator';

const generator: Generator = async (npmOptions, options) => {
  baseGenerator(npmOptions, options, 'riot', {
    extraPackages: ['riot-tag-loader'],
  });
};

export default generator;
