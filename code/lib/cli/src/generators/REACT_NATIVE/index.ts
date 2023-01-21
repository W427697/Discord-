import { join } from 'path';
import { getBabelDependencies, copyTemplate } from '../../helpers';
import { getCliDir } from '../../dirs';
import type { JsPackageManager } from '../../js-package-manager';
import type { NpmOptions } from '../../NpmOptions';

const generator = async (
  packageManager: JsPackageManager,
  npmOptions: NpmOptions
): Promise<void> => {
  const packageJson = packageManager.retrievePackageJson();

  const missingReactDom =
    !packageJson.dependencies['react-dom'] && !packageJson.devDependencies['react-dom'];
  const reactVersion = packageJson.dependencies.react;

  const addonsWithPeerDeps = [
    // addon-ondevice-controls peer deps
    'react-native-safe-area-context',
    '@react-native-async-storage/async-storage',
    '@react-native-community/datetimepicker',
    '@react-native-community/slider',
    // other base storybook addons needed
    '@storybook/addon-actions',
    // native addons, change these to remove the version once v6 stable is released
    '@storybook/addon-ondevice-controls@6.0.1-beta.11',
    '@storybook/addon-ondevice-actions@6.0.1-beta.11',
  ];

  const packagesToResolve = [...addonsWithPeerDeps, '@storybook/react-native@6.0.1-beta.11'];

  const resolvedPackages = await packageManager.getVersionedPackages(packagesToResolve);

  const babelDependencies = await getBabelDependencies(packageManager, packageJson);

  const packages = [
    ...babelDependencies,
    ...resolvedPackages,
    missingReactDom && reactVersion && `react-dom@${reactVersion}`,
  ].filter(Boolean);

  packageManager.addDependencies({ ...npmOptions, packageJson }, packages);

  const templateDir = join(getCliDir(), 'templates', 'react-native');
  copyTemplate(templateDir);
};

export default generator;
