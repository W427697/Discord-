import baseGenerator, { Generator } from '../generator';
import { copyTemplate } from '../../helpers';

const generator: Generator = async (npmOptions, options) => {
  baseGenerator(npmOptions, options, 'web-components', {
    extraPackages: ['lit-html'],
  });
  copyTemplate(__dirname, options.storyFormat);
};

export default generator;
