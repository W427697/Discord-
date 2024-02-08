import chalk from 'chalk';
import dedent from 'ts-dedent';
import type { Fix } from '../types';

export const removeJestTestingLibrary: Fix<{ incompatiblePackages: string[] }> = {
  id: 'remove-jest-testing-library',
  promptOnly: true,
  async check({ mainConfig, packageManager }) {
    const deps = await packageManager.getAllDependencies();

    const incompatiblePackages = Object.keys(deps).filter(
      (it) => it === '@storybook/jest' || it === '@storybook/testing-library'
    );
    return incompatiblePackages.length ? { incompatiblePackages } : null;
  },
  prompt({ incompatiblePackages }) {
    return dedent`
      ${chalk.bold(
        'Attention'
      )}: We've detected that you're using the following packages which are known to be incompatible with Storybook 8:

      ${incompatiblePackages.map((name) => `- ${chalk.cyan(`${name}`)}`).join('\n')}
      
      Run:
       npx sb migrate migrate-to-test-package --glob="**/*.stories.@(js|jsx|ts|tsx)"
       
       To migrate to the @storybook/test package.
    `;
  },
};
