import baseGenerator, { Generator } from '../generator';
import { StoryFormat } from '../../project_types';
import { copyTemplate } from '../../helpers';

const generator: Generator = async (npmOptions, options) => {
  baseGenerator(npmOptions, options, 'web-components', {
    dirname: __dirname,
    extraPackages: ['lit-html'],
  });
  copyTemplate(__dirname, StoryFormat.CSF);
};

export default generator;
