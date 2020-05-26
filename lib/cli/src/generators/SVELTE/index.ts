import baseGenerator, { Generator } from '../generator';
import { StoryFormat } from '../../project_types';

const generator: Generator = async (npmOptions, options) => {
  baseGenerator(npmOptions, options, 'svelte', {
    dirname: options.storyFormat === StoryFormat.MDX ? __dirname : undefined,
    extraPackages: ['svelte', 'svelte-loader'],
  });
};

export default generator;
