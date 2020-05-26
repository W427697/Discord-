import path from 'path';
import fs from 'fs';

import baseGenerator, { Generator } from '../generator';
import { StoryFormat } from '../../project_types';

const generator: Generator = async (npmOptions, options) => {
  await baseGenerator(npmOptions, options, 'react', {
    extraAddons: ['@storybook/preset-create-react-app'],
    dirname: options.storyFormat === StoryFormat.MDX ? __dirname : undefined,
    staticDir: fs.existsSync(path.resolve('./public')) ? 'public' : undefined,
  });
};

export default generator;
