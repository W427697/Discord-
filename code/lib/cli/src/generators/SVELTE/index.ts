import { baseGenerator } from '../baseGenerator';
import type { Generator } from '../types';

const generator: Generator = async (packageManager, npmOptions, options) => {
  await baseGenerator(packageManager, npmOptions, options, 'svelte', {
    extensions: ['js', 'ts', 'svelte'],
    extraAddons: ['@storybook/addon-svelte-csf'],

    // fix for https://app.circleci.com/pipelines/github/storybookjs/storybook/76699/workflows/f2bd740a-637a-45b8-9bd2-19d18e7be387/jobs/659133
    extraPackages: ['@storybook/client-logger'],
  });
};

export default generator;
