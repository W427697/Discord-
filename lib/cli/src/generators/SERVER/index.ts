import { copyTemplate } from '@storybook/package-tools';
import { baseGenerator, Generator } from '../baseGenerator';

const generator: Generator = async (packageManager, npmOptions, options) => {
  baseGenerator(packageManager, npmOptions, options, 'server', {
    extensions: ['json'],
  });

  copyTemplate(__dirname);
};

export default generator;
