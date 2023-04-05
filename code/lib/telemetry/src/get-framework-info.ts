import type { PackageJson, StorybookConfig } from '@storybook/types';
import { getActualPackageJson } from './package-json';

const knownRenderers = [
  '@storybook/html',
  '@storybook/react',
  '@storybook/svelte',
  '@storybook/vue3',
  '@storybook/preact',
  '@storybook/server',
  '@storybook/vue',
  '@storybook/web-components',
  '@storybook/angular',
  '@storybook/ember',
  'storybook-solidjs',
  '@builder.io/qwik', // The Qwik framework is a renderer too, so the best we can do here is to detect the actual Qwik package
];

const knownBuilders = ['@storybook/builder-webpack5', '@storybook/builder-vite'];

function findMatchingPackage(packageJson: PackageJson, packages: string[]) {
  const { name = '', version, dependencies, devDependencies, peerDependencies } = packageJson;

  const allDependencies = {
    // We include the framework itself because it may be a renderer too (e.g. angular)
    [name]: version,
    ...dependencies,
    ...devDependencies,
    ...peerDependencies,
  };

  return packages.find((pkg) => allDependencies[pkg]);
}

export async function getFrameworkInfo(mainConfig: StorybookConfig) {
  const { framework: frameworkInput } = mainConfig;

  if (!frameworkInput) return {};

  const framework = typeof frameworkInput === 'string' ? { name: frameworkInput } : frameworkInput;

  const frameworkPackageJson = await getActualPackageJson(framework.name);

  const builder = findMatchingPackage(frameworkPackageJson, knownBuilders);
  const renderer = findMatchingPackage(frameworkPackageJson, knownRenderers);

  return {
    framework,
    builder,
    renderer,
  };
}
