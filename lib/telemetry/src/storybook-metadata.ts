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

type Dependency = {
  name: string;
  version: string;
};

export type StorybookMetadata = {
  id?: string;
  version: string;
  language: 'typescript' | 'javascript';
  framework: {
    name: string;
    options: Record<string, any>;
  };
  builder?: {
    name: string;
    options: Record<string, any>;
  };
  typescriptOptions?: Partial<TypescriptOptions>;
  addons?: Dependency[];
  storybookPackages?: Dependency[];
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

  console.time('getStorybookMetadata');
  const packageJson = readPkgUp.sync({ cwd: process.cwd() }).packageJson as PackageJson;

  const configDir =
    getStorybookConfiguration(packageJson.scripts.storybook, '-c', '--config-dir') ?? '.storybook';

  const mainConfig = loadMainConfig({ configDir });
  cachedMetadata = computeStorybookMetadata({ mainConfig, packageJson });
  // @TODO: remove this, it's for testing purposes and it's taking about 6.5s
  console.timeEnd('getStorybookMetadata');
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

    const projectRootPath = path.relative(process.cwd(), String(projectRootBuffer).trimEnd());

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
    // temporary just for testing purposes, should be used elsewhere
    id: getProjectId(),
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

  let addons: Dependency[] = [];
  if (mainConfig.addons) {
    addons = mainConfig.addons
      .map((addon: string | Record<string, any>) => {
        if (typeof addon === 'string') {
          return addon.replace('/register', '');
        }

        return addon;
      })
      .map((addon: string | Record<string, any>) => {
        if (typeof addon === 'string') {
          return {
            name: addon,
            version: allDependencies[addon],
          };
        }

        return {
          name: addon.name,
          options: addon.options,
          version: allDependencies[addon.name],
        };
      });
  }

  const addonNames = addons.map((addon: Dependency) => addon.name);

  // all Storybook deps minus the addons
  const storybookPackages = Object.keys(allDependencies)
    .filter((dep) => dep.includes('storybook') && !addonNames.includes(dep))
    .map((dep) => ({ name: dep, version: allDependencies[dep] }));

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
