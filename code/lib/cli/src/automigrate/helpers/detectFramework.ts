import type { PackageJson } from '@storybook/types';
import { frameworkPackages } from '@storybook/core-common';
import prompts from 'prompts';

export const detectFramework = async (packageJson: PackageJson) => {
  const allDependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.peerDependencies,
  };

  // Pull the framework from dependencies in package.json
  const matches = Object.keys(frameworkPackages).filter((pkg) => !!allDependencies[pkg]);
  let [frameworkPackage] = matches;
  if (matches.length > 1) {
    const response = await prompts([
      {
        type: 'select',
        name: 'frameworkPackage',
        message:
          'Tried to detect a Storybook framework in your project but found multiple. This could happen in monorepos, when projects contain multiple Storybook packages in package.json. Please select the correct one:',
        choices: matches.map((type) => ({
          title: type,
          value: type,
        })),
      },
    ]);
    frameworkPackage = response.frameworkPackage;
  }

  return frameworkPackage;
};
