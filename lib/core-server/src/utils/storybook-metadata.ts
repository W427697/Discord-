import readPkgUp from 'read-pkg-up';
import fs from 'fs-extra';
import { execSync } from 'child_process';
import {
  Options,
  NormalizedStoriesSpecifier,
  normalizeStories,
  StorybookConfig,
  TypescriptOptions,
  loadMainConfig,
  PackageJson,
  getStorybookInfo,
} from '@storybook/core-common';

import { Request, Response, Router } from 'express';
import { debounce } from 'lodash';
import { STORY_INDEX_INVALIDATED } from '@storybook/core-events';
import { ServerChannel } from './get-server-channel';
import { StoryIndexGenerator } from './StoryIndexGenerator';
import { watchStorySpecifiers } from './watch-story-specifiers';

type Dependency = {
  name: string;
  version: string;
};

type StorybookMetadata = {
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
  let projectId = process.cwd();
  try {
    const originBuffer = execSync(`git config --local --get remote.origin.url`, {
      timeout: 1000,
      stdio: `pipe`,
    });

    // we use a combination of remoteUrl and working directory
    // to separate multiple storybooks from the same project (e.g. monorepo)
    projectId = `${String(originBuffer).trim()}${projectId}`;
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

  return {};
};

let cachedMetadata: StorybookMetadata;
export const getStorybookMetadata = (configDir = '.storybook') => {
  if (cachedMetadata) {
    return cachedMetadata;
  }

  console.time('getStorybookMetadata');
  const packageJson = readPkgUp.sync({ cwd: process.cwd() }).packageJson as PackageJson;
  const mainConfig = loadMainConfig({ configDir });
  cachedMetadata = computeStorybookMetadata({ mainConfig, packageJson });
  // @TODO: remove this, it's for testing purposes and it's taking about 6.5s
  console.timeEnd('getStorybookMetadata');
  return cachedMetadata;
};

export const computeStorybookMetadata = ({
  packageJson,
  mainConfig,
}: {
  packageJson: PackageJson;
  mainConfig: StorybookConfig & Record<string, any>;
}): StorybookMetadata => {
  const metadata: Partial<StorybookMetadata> = {
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
      options: typeof builder === 'string' ? {} : builder.options,
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

export async function extractStorybookMetadata(
  outputFile: string,
  normalizedStories: NormalizedStoriesSpecifier[],
  options: {
    configDir: string;
    workingDir: string;
    storiesV2Compatibility: boolean;
    packageJson: any;
    storyStoreV7: boolean;
  }
) {
  const generator = new StoryIndexGenerator(normalizedStories, options);
  await generator.initialize();

  const index = await generator.getIndex();
  const storyCount = Object.keys(index.stories).length;
  const metadata: StorybookMetadata = {
    ...getStorybookMetadata(),
    index: {
      storyCount,
      version: index.v,
    },
  };
  await fs.writeJson(outputFile, metadata);
}

export async function useStorybookMetadata(
  router: Router,
  serverChannel: ServerChannel,
  options: Options,
  workingDir: string = process.cwd()
) {
  // @TODO: extract all these normalizeStories + storyIndex stuff to be reused between stories.json and metadata.json
  const normalizedStories = normalizeStories(await options.presets.apply('stories'), {
    configDir: options.configDir,
    workingDir,
  });
  const features = await options.presets.apply<StorybookConfig['features']>('features');
  const generator = new StoryIndexGenerator(normalizedStories, {
    configDir: options.configDir,
    workingDir,
    storiesV2Compatibility: !features?.breakingChangesV7 && !features?.storyStoreV7,
    storyStoreV7: features?.storyStoreV7,
  });

  let started = false;
  const maybeInvalidate = debounce(() => serverChannel.emit(STORY_INDEX_INVALIDATED), 1000, {
    leading: true,
  });
  async function ensureStarted() {
    if (started) return;
    started = true;

    watchStorySpecifiers(normalizedStories, { workingDir }, (specifier, path, removed) => {
      generator.invalidate(specifier, path, removed);
      maybeInvalidate();
    });

    await generator.initialize();
  }

  router.use('/metadata.json', async (req: Request, res: Response) => {
    await ensureStarted();

    let index;
    try {
      index = await generator.getIndex();
      // eslint-disable-next-line no-empty
    } catch (err) {}

    const metadata: StorybookMetadata = getStorybookMetadata();
    if (index) {
      metadata.index = {
        storyCount: Object.keys(index.stories).length,
        version: index.v,
      };
    }

    res.header('Content-Type', 'application/json');
    res.send(JSON.stringify(metadata));
  });
}
