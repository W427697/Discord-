import { createBlocker } from './types';
import { dedent } from 'ts-dedent';
import { lt } from 'semver';

const minimalVersionsMap = {
  'react-scripts': '5.0.0',
  vue: '3.0.0',
};

type Result = {
  installedVersion: string | undefined;
  packageName: keyof typeof minimalVersionsMap;
  minimumVersion: string;
};
const typedKeys = <TKey extends string>(obj: Record<TKey, any>) => Object.keys(obj) as TKey[];

export const blocker = createBlocker({
  id: 'dependenciesVersions',
  async check({ packageManager }) {
    const list = await Promise.all(
      typedKeys(minimalVersionsMap).map(async (packageName) => ({
        packageName,
        installedVersion: await packageManager.getVersion(packageName),
        minimumVersion: minimalVersionsMap[packageName],
      }))
    );

    return list.reduce<false | Result>((acc, { installedVersion, minimumVersion, packageName }) => {
      if (acc) {
        return acc;
      }
      if (packageName && installedVersion && lt(installedVersion, minimumVersion)) {
        return {
          installedVersion,
          packageName,
          minimumVersion,
        };
      }
      return acc;
    }, false);
  },
  message(options, data) {
    return `Found ${data.packageName} version: ${data.installedVersion}, please upgrade to ${data.minimumVersion} or higher.`;
  },
  log(options, data) {
    switch (data.packageName) {
      case 'react-scripts':
        return dedent`
          Support react-script < 5.0.0 has been removed.
          Please see the migration guide for more information:
          https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#create-react-app-dropped-cra4-support
          
          Upgrade to the latest version of react-scripts.
        `;
      case 'vue':
        return dedent`
          Support for Vue 2 has been removed.
          Please see the migration guide for more information:
          https://v3-migration.vuejs.org/

          Upgrade to the latest version of Vue.
        `;
      default:
        throw new Error(`Unexpected package name: ${data.packageName}`);
    }
  },
});
