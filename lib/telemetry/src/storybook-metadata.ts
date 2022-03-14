import readPkgUp from 'read-pkg-up';
import { execSync } from 'child_process';
import {
  StorybookConfig,
  TypescriptOptions,
  loadMainConfig,
  PackageJson,
  getStorybookInfo,
  getStorybookConfiguration,
} from '@storybook/core-common';
import path from 'path';
import { oneWayHash } from './oneWayHash';

interface Dependency {
  name: string;
  version: string;
}

interface StorybookAddon extends Dependency {
  options: any;
}

export type StorybookMetadata = {
  anonymousId?: string;
  version: string;
  language: 'typescript' | 'javascript';
  framework: {
    name: string;
    options?: any;
  };
  builder?: {
    name: string;
    options: Record<string, any>;
  };
  typescriptOptions?: Partial<TypescriptOptions>;
  addons?: Record<string, StorybookAddon>;
  storybookPackages?: Record<string, Dependency>;
  metaFramework?: {
    name: string;
    packageName: string;
    version: string;
  };
  hasStorybookEslint?: boolean;
  hasStaticDirs?: boolean;
  hasCustomWebpack?: boolean;
  hasCustomBabel?: boolean;
  features?: StorybookConfig['features'];
  refCount?: number;
  index?: {
    storyCount?: number;
    version?: number;
  };
};

let cachedMetadata: StorybookMetadata;
export const getStorybookMetadata = () => {
  if (cachedMetadata) {
    return cachedMetadata;
  }

  const packageJson = readPkgUp.sync({ cwd: process.cwd() }).packageJson as PackageJson;
  const configDir =
    (getStorybookConfiguration(packageJson.scripts.storybook, '-c', '--config-dir') as string) ??
    '.storybook';
  const mainConfig = loadMainConfig({ configDir });
  cachedMetadata = computeStorybookMetadata({ mainConfig, packageJson });
  return cachedMetadata;
};

export const metaFrameworks = {
  next: 'Next',
  'react-scripts': 'CRA',
  gatsby: 'Gatsby',
  '@nuxtjs/storybook': 'nuxt',
  '@nrwl/storybook': 'nx',
  '@vue/cli-service': 'vue-cli',
  '@sveltejs/kit': 'svelte-kit',
} as Record<string, string>;

// To be used by events
export const getProjectId = () => {
  let projectId;
  try {
    const projectRootBuffer = execSync(`git rev-parse --show-toplevel`, {
      timeout: 1000,
      stdio: `pipe`,
    });

    const projectRootPath = path.relative(String(projectRootBuffer).trimEnd(), process.cwd());

    const originBuffer = execSync(`git config --local --get remote.origin.url`, {
      timeout: 1000,
      stdio: `pipe`,
    });

    // we use a combination of remoteUrl and working directory
    // to separate multiple storybooks from the same project (e.g. monorepo)
    projectId = `${String(originBuffer).trim()}${projectRootPath}`;
    // eslint-disable-next-line no-empty
  } catch (_) {}

  return projectId;
};

// TODO: This should be removed in 7.0 as the framework.options field in main.js will replace this
const getFrameworkOptions = (mainConfig: any) => {
  const possibleOptions = [
    'angular',
    'ember',
    'html',
    'preact',
    'react',
    'server',
    'svelte',
    'vue',
    'vue3',
    'webComponents',
  ].map((opt) => `${opt}Options`);

  // eslint-disable-next-line no-restricted-syntax
  for (const opt of possibleOptions) {
    if (opt in mainConfig) {
      return mainConfig[opt] as any;
    }
  }

  return null;
};

// Analyze a combination of information from main.js and package.json
// to provide telemetry over a Storybook project
export const computeStorybookMetadata = ({
  packageJson,
  mainConfig,
}: {
  packageJson: PackageJson;
  mainConfig: StorybookConfig & Record<string, any>;
}): StorybookMetadata => {
  const metadata: Partial<StorybookMetadata> = {
    anonymousId: oneWayHash(getProjectId()),
    metaFramework: null,
    builder: null,
    hasCustomBabel: null,
    hasCustomWebpack: null,
    hasStaticDirs: null,
    index: null,
    hasStorybookEslint: null,
    typescriptOptions: null,
    framework: null,
    addons: null,
    features: null,
    language: null,
    refCount: null,
    storybookPackages: null,
    version: null,
  };

  // @TODO we should ask the package manager for the versions of addons etc.
  // instead of relying solely on package.json containing these entries
  const allDependencies = {
    ...packageJson?.dependencies,
    ...packageJson?.devDependencies,
    ...packageJson?.peerDependencies,
  };

  const metaFramework = Object.keys(allDependencies).find((dep) => !!metaFrameworks[dep]);
  if (metaFramework) {
    metadata.metaFramework = {
      name: metaFrameworks[metaFramework],
      packageName: metaFramework,
      version: allDependencies[metaFramework],
    };
  }

  metadata.hasCustomBabel = !!mainConfig.babel;
  metadata.hasCustomWebpack = !!mainConfig.webpackFinal;
  metadata.hasStaticDirs = !!mainConfig.staticDirs;

  if (mainConfig.typescript) {
    metadata.typescriptOptions = mainConfig.typescript;
  }

  if (mainConfig.core?.builder) {
    const { builder } = mainConfig.core;

    metadata.builder = {
      name: typeof builder === 'string' ? builder : builder.name,
      options: typeof builder === 'string' ? null : builder.options,
    };
  }

  if (mainConfig.refs) {
    metadata.refCount = Object.keys(mainConfig.refs).length;
  }

  if (mainConfig.features) {
    metadata.features = mainConfig.features;
  }

  const addons: Record<string, StorybookAddon> = {};
  if (mainConfig.addons) {
    mainConfig.addons.forEach((addon) => {
      let result;
      let options = {};
      if (typeof addon === 'string') {
        result = addon.replace('/register', '');
      } else {
        options = addon.options;
        result = addon.name;
      }

      addons[result] = {
        name: result,
        options,
        version: allDependencies[result],
      };
    });
  }

  const addonNames = Object.keys(addons);

  // all Storybook deps minus the addons
  const storybookPackages = Object.keys(allDependencies)
    .filter((dep) => dep.includes('storybook') && !addonNames.includes(dep))
    .reduce((acc, dep) => {
      return {
        ...acc,
        [dep]: { name: dep, version: allDependencies[dep] },
      };
    }, {});

  const language = allDependencies.typescript ? 'typescript' : 'javascript';

  const hasStorybookEslint = !!allDependencies['eslint-plugin-storybook'];

  const storybookInfo = getStorybookInfo(packageJson);
  return {
    ...metadata,
    version: storybookInfo.version,
    language,
    storybookPackages,
    framework: {
      name: storybookInfo.framework,
      options: getFrameworkOptions(mainConfig),
    },
    addons,
    hasStorybookEslint,
  };
};
