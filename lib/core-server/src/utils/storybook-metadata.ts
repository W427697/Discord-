import fs from 'fs-extra';
import { execSync } from 'child_process';
import {
  Options,
  getInterpretedFile,
  serverRequire,
  NormalizedStoriesSpecifier,
  normalizeStories,
  StorybookConfig,
  TypescriptOptions,
} from '@storybook/core-common';

import { resolve } from 'path';
import global from 'global';
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
  metaFramework?: string;
  features?: StorybookConfig['features'];
  userSpecifiedFeatures?: StorybookConfig['features'];
  refCount?: number;
  index: {
    storyCount?: number;
    version?: number;
  };
};

const metaFrameworks = {
  next: 'Next',
  'react-scripts': 'CRA',
  gatsby: 'Gatsby',
  '@nuxtjs/storybook': 'nuxt',
  '@nrwl/storybook': 'nx',
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

export const getStorybookMetadata = (options: Options): Omit<StorybookMetadata, 'index'> => {
  const metadata: Partial<StorybookMetadata> = {};

  const mainConfigFile = getInterpretedFile(resolve(options.configDir, 'main'));

  const mainConfig = serverRequire(mainConfigFile) as StorybookConfig;
  // { addons, refs, managerBabel, managerWebpack, features }
  const allDependencies = {
    ...options.packageJson?.dependencies,
    ...options.packageJson?.devDependencies,
    ...options.packageJson?.peerDependencies,
  };

  const metaFramework = Object.keys(allDependencies).find((dep) => !!metaFrameworks[dep]);
  if (metaFramework) {
    metadata.metaFramework = metaFramework;
  }

  if (mainConfig.typescript) {
    metadata.typescriptOptions = mainConfig.typescript;
  }

  if (mainConfig.core.builder) {
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
    metadata.userSpecifiedFeatures = mainConfig.features;
  }

  const addons = mainConfig.addons
    ?.map((addon: string) => addon.replace('/register', ''))
    .map((addon: string) => ({ name: addon, version: allDependencies[addon] }));

  const addonNames = addons.map((addon: Dependency) => addon.name);

  // all Storybook deps minus the addons
  const storybookPackages = Object.keys(allDependencies)
    .filter((dep) => dep.includes('storybook') && !addonNames.includes(dep))
    .map((dep) => ({ name: dep, version: allDependencies[dep] }));

  return {
    version: '', // @TODO: add this
    language: 'javascript', // @TODO: use something like detectLanguage from CLI
    ...metadata,
    features: options.features,
    storybookPackages,
    framework: {
      name: options.framework,
      options: getFrameworkOptions(mainConfig),
    },
    addons,
    metaFramework,
  };
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

  return undefined;
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
    ...getStorybookMetadata(options as any),
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

    try {
      const index = await generator.getIndex();
      const metadata: StorybookMetadata = {
        ...global.METADATA,
        index: {
          storyCount: Object.keys(index.stories).length,
          version: index.v,
        },
      };
      res.header('Content-Type', 'application/json');
      res.send(JSON.stringify(metadata));
    } catch (err) {
      res.status(500);
      res.send(err.message);
    }
  });
}
