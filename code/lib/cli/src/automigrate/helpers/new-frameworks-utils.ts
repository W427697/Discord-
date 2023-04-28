import { frameworkPackages } from '@junk-temporary-prototypes/core-common';
import type { Preset, StorybookConfig } from '@junk-temporary-prototypes/types';
import findUp from 'find-up';

const logger = console;

export const packagesMap: Record<string, { webpack5?: string; vite?: string }> = {
  '@junk-temporary-prototypes/react': {
    webpack5: '@junk-temporary-prototypes/react-webpack5',
    vite: '@junk-temporary-prototypes/react-vite',
  },
  '@junk-temporary-prototypes/preact': {
    webpack5: '@junk-temporary-prototypes/preact-webpack5',
    vite: '@junk-temporary-prototypes/preact-vite',
  },
  '@junk-temporary-prototypes/server': {
    webpack5: '@junk-temporary-prototypes/server-webpack5',
  },
  '@junk-temporary-prototypes/ember': {
    webpack5: '@junk-temporary-prototypes/ember',
  },
  '@junk-temporary-prototypes/angular': {
    webpack5: '@junk-temporary-prototypes/angular',
  },
  '@junk-temporary-prototypes/vue': {
    webpack5: '@junk-temporary-prototypes/vue-webpack5',
    vite: '@junk-temporary-prototypes/vue-vite',
  },
  '@junk-temporary-prototypes/vue3': {
    webpack5: '@junk-temporary-prototypes/vue3-webpack5',
    vite: '@junk-temporary-prototypes/vue3-vite',
  },
  '@junk-temporary-prototypes/svelte': {
    webpack5: '@junk-temporary-prototypes/svelte-webpack5',
    vite: '@junk-temporary-prototypes/svelte-vite',
  },
  '@junk-temporary-prototypes/web-components': {
    webpack5: '@junk-temporary-prototypes/web-components-webpack5',
    vite: '@junk-temporary-prototypes/web-components-vite',
  },
  '@junk-temporary-prototypes/html': {
    webpack5: '@junk-temporary-prototypes/html-webpack5',
    vite: '@junk-temporary-prototypes/html-vite',
  },
};

const communityFrameworks: { vite: string[]; webpack5: string[] } = {
  vite: ['storybook-framework-qwik', 'storybook-solidjs-vite'],
  webpack5: [],
};

const viteConfigFiles = ['vite.config.js', 'vite.config.cjs', 'vite.config.mjs', 'vite.config.ts'];
const webpackConfigFiles = [
  'webpack.config.js',
  'webpack.config.cjs',
  'webpack.config.mjs',
  'webpack.config.ts',
];

type BuilderType = 'vite' | 'webpack5';

export const detectBuilderInfo = async ({
  mainConfig,
  configDir,
  packageDependencies,
}: {
  mainConfig: StorybookConfig & { builder?: string | Preset };
  configDir: string;
  packageDependencies: Record<string, string>;
}): Promise<{ name: BuilderType; options: any }> => {
  let builderOptions = {};
  let builderName: BuilderType;
  let builderOrFrameworkName;

  const { core = {}, framework } = mainConfig;
  const { builder } = core;

  if (builder) {
    if (typeof builder === 'string') {
      builderOrFrameworkName = builder;
    } else {
      builderOrFrameworkName = builder.name;

      builderOptions = builder.options || {};
    }
  } else if (framework) {
    const frameworkName = typeof framework === 'string' ? framework : framework.name;
    if (Object.keys(frameworkPackages).includes(frameworkName)) {
      builderOrFrameworkName = frameworkName;
      builderOptions = typeof framework === 'object' ? framework.options?.builder : {};
    }
  }

  // if there is no builder or framework field, we look for config files instead
  if (!builderOrFrameworkName) {
    const viteConfigFile = await findUp(viteConfigFiles, { cwd: configDir });
    if (viteConfigFile) {
      logger.info(
        `No builder or framework field, detected Storybook builder via: ${viteConfigFile}`
      );
      builderOrFrameworkName = 'vite';
    } else {
      const webpackConfigFile = await findUp(webpackConfigFiles, { cwd: configDir });
      if (webpackConfigFile) {
        logger.info(
          `No builder or framework field, detected Storybook builder via: ${webpackConfigFile}`
        );
        builderOrFrameworkName = 'webpack5';
      }
    }
  }

  // if builder is still not detected, rely on package dependencies
  if (!builderOrFrameworkName) {
    if (
      packageDependencies['@junk-temporary-prototypes/builder-vite'] ||
      packageDependencies['storybook-builder-vite']
    ) {
      builderOrFrameworkName = 'vite';
    } else if (
      packageDependencies['@junk-temporary-prototypes/builder-webpack5'] ||
      packageDependencies['@junk-temporary-prototypes/manager-webpack5']
    ) {
      builderOrFrameworkName = 'webpack5';
    }
  }

  if (
    builderOrFrameworkName?.includes('vite') ||
    communityFrameworks.vite.includes(builderOrFrameworkName)
  ) {
    builderName = 'vite';
  } else if (
    builderOrFrameworkName?.includes('webpack') ||
    communityFrameworks.webpack5.includes(builderOrFrameworkName)
  ) {
    builderName = 'webpack5';
  } else {
    // we've exhausted all options, default to webpack5.
    // reason to default to webpack5 is that whoever comes from SB 6.5, if they
    // don't have a builder field or any vite config file or dependency, they are most likely using webpack5
    builderName = 'webpack5';
  }

  return {
    name: builderName,
    options: builderOptions,
  };
};

export const getNextjsAddonOptions = (addons: Preset[]) => {
  const nextjsAddon = addons?.find((addon) =>
    typeof addon === 'string'
      ? addon === 'storybook-addon-next'
      : addon.name === 'storybook-addon-next'
  );

  if (!nextjsAddon || typeof nextjsAddon === 'string') {
    return {};
  }

  return nextjsAddon.options || {};
};
