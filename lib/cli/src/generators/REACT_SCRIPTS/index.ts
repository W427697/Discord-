import path from 'path';
import fs from 'fs';

import { baseGenerator, Generator } from '../generator';
import { copyTemplate } from '../../helpers';
import { StoryFormat } from '../../project_types';

const generator: Generator = async (npmOptions, options) => {
  await baseGenerator(npmOptions, options, 'react', {
    extraAddons: ['@storybook/preset-create-react-app'],
    staticDir: fs.existsSync(path.resolve('./public')) ? 'public' : undefined,
  });
  if (options.storyFormat === StoryFormat.MDX) {
    copyTemplate(__dirname, StoryFormat.MDX);
  }
};

export default generator;
