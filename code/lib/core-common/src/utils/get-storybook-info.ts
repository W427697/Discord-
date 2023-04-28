import path from 'path';
import fse from 'fs-extra';
import type { CoreCommon_StorybookInfo, PackageJson } from '@junk-temporary-prototypes/types';
import { getStorybookConfiguration } from './get-storybook-configuration';

export const rendererPackages: Record<string, string> = {
  '@junk-temporary-prototypes/react': 'react',
  '@junk-temporary-prototypes/vue': 'vue',
  '@junk-temporary-prototypes/vue3': 'vue3',
  '@junk-temporary-prototypes/angular': 'angular',
  '@junk-temporary-prototypes/html': 'html',
  '@junk-temporary-prototypes/web-components': 'web-components',
  '@junk-temporary-prototypes/polymer': 'polymer',
  '@junk-temporary-prototypes/ember': 'ember',
  '@junk-temporary-prototypes/marko': 'marko',
  '@junk-temporary-prototypes/mithril': 'mithril',
  '@junk-temporary-prototypes/riot': 'riot',
  '@junk-temporary-prototypes/svelte': 'svelte',
  '@junk-temporary-prototypes/preact': 'preact',
  '@junk-temporary-prototypes/rax': 'rax',
  '@junk-temporary-prototypes/server': 'server',
  // community (outside of monorepo)
  'storybook-framework-qwik': 'qwik',
  'storybook-solidjs': 'solid',
};

export const frameworkPackages: Record<string, string> = {
  '@junk-temporary-prototypes/angular': 'angular',
  '@junk-temporary-prototypes/ember': 'ember',
  '@junk-temporary-prototypes/html-vite': 'html-vite',
  '@junk-temporary-prototypes/html-webpack5': 'html-webpack5',
  '@junk-temporary-prototypes/nextjs': 'nextjs',
  '@junk-temporary-prototypes/preact-vite': 'preact-vite',
  '@junk-temporary-prototypes/preact-webpack5': 'preact-webpack5',
  '@junk-temporary-prototypes/react-vite': 'react-vite',
  '@junk-temporary-prototypes/react-webpack5': 'react-webpack5',
  '@junk-temporary-prototypes/server-webpack5': 'server-webpack5',
  '@junk-temporary-prototypes/svelte-vite': 'svelte-vite',
  '@junk-temporary-prototypes/svelte-webpack5': 'svelte-webpack5',
  '@junk-temporary-prototypes/sveltekit': 'sveltekit',
  '@junk-temporary-prototypes/vue3-vite': 'vue3-vite',
  '@junk-temporary-prototypes/vue3-webpack5': 'vue3-webpack5',
  '@junk-temporary-prototypes/vue-vite': 'vue-vite',
  '@junk-temporary-prototypes/vue-webpack5': 'vue-webpack5',
  '@junk-temporary-prototypes/web-components-vite': 'web-components-vite',
  '@junk-temporary-prototypes/web-components-webpack5': 'web-components-webpack5',
  // community (outside of monorepo)
  'storybook-framework-qwik': 'qwik',
  'storybook-solidjs-vite': 'solid',
};

const logger = console;

const findDependency = (
  { dependencies, devDependencies, peerDependencies }: PackageJson,
  predicate: (entry: [string, string | undefined]) => string
) => [
  Object.entries(dependencies || {}).find(predicate),
  Object.entries(devDependencies || {}).find(predicate),
  Object.entries(peerDependencies || {}).find(predicate),
];

const getRendererInfo = (packageJson: PackageJson) => {
  // Pull the viewlayer from dependencies in package.json
  const [dep, devDep, peerDep] = findDependency(packageJson, ([key]) => rendererPackages[key]);
  const [pkg, version] = dep || devDep || peerDep || [];
  const renderer = pkg ? rendererPackages[pkg] : undefined;

  if (dep && devDep && dep[0] === devDep[0]) {
    logger.warn(
      `Found "${dep[0]}" in both "dependencies" and "devDependencies". This is probably a mistake.`
    );
  }
  if (dep && peerDep && dep[0] === peerDep[0]) {
    logger.warn(
      `Found "${dep[0]}" in both "dependencies" and "peerDependencies". This is probably a mistake.`
    );
  }

  return {
    version,
    framework: renderer,
    frameworkPackage: pkg,
    renderer,
    rendererPackage: pkg,
  };
};

const validConfigExtensions = ['ts', 'js', 'tsx', 'jsx', 'mjs', 'cjs'];

const findConfigFile = (prefix: string, configDir: string) => {
  const filePrefix = path.join(configDir, prefix);
  const extension = validConfigExtensions.find((ext: string) =>
    fse.existsSync(`${filePrefix}.${ext}`)
  );
  return extension ? `${filePrefix}.${extension}` : null;
};

const getConfigInfo = (packageJson: PackageJson, configDir?: string) => {
  let storybookConfigDir = configDir ?? '.storybook';
  const storybookScript = packageJson.scripts?.['storybook'];
  if (storybookScript && !configDir) {
    const configParam = getStorybookConfiguration(storybookScript, '-c', '--config-dir');
    if (configParam) storybookConfigDir = configParam;
  }

  return {
    configDir,
    mainConfig: findConfigFile('main', storybookConfigDir),
    previewConfig: findConfigFile('preview', storybookConfigDir),
    managerConfig: findConfigFile('manager', storybookConfigDir),
  };
};

export const getStorybookInfo = (packageJson: PackageJson, configDir?: string) => {
  const rendererInfo = getRendererInfo(packageJson);
  const configInfo = getConfigInfo(packageJson, configDir);

  return {
    ...rendererInfo,
    ...configInfo,
  } as CoreCommon_StorybookInfo;
};
