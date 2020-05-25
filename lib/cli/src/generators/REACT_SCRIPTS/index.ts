import path from 'path';
import fs from 'fs';
import { retrievePackageJson, writePackageJson } from '../../helpers';

import baseGenerator, { Generator } from '../generator';
import { StoryFormat } from '../../project_types';

const generator: Generator = async (npmOptions, options) => {
  await baseGenerator(npmOptions, options, 'react', {
    extraAddons: ['@storybook/preset-create-react-app'],
    dirname: options.storyFormat === StoryFormat.MDX ? __dirname : undefined,
  });
  if (fs.existsSync(path.resolve('./public'))) {
    const packageJson = await retrievePackageJson();
    // has a public folder and add support to it.
    packageJson.scripts.storybook += ' -s public';
    packageJson.scripts['build-storybook'] += ' -s public';
    writePackageJson(packageJson);
  }
};

export default generator;
