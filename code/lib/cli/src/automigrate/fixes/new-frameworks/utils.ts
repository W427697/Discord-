import type { Preset, StorybookConfig } from '@storybook/types';

const logger = console;

export const packagesMap: Record<string, { webpack5?: string; vite?: string }> = {
  '@storybook/react': {
    webpack5: '@storybook/react-webpack5',
    vite: '@storybook/react-vite',
  },
  '@storybook/preact': {
    webpack5: '@storybook/preact-webpack5',
    vite: '@storybook/preact-vite',
  },
  '@storybook/server': {
    webpack5: '@storybook/server-webpack5',
  },
  '@storybook/ember': {
    webpack5: '@storybook/ember',
  },
  '@storybook/angular': {
    webpack5: '@storybook/angular',
  },
  '@storybook/vue': {
    webpack5: '@storybook/vue-webpack5',
    vite: '@storybook/vue-vite',
  },
  '@storybook/vue3': {
    webpack5: '@storybook/vue3-webpack5',
    vite: '@storybook/vue3-vite',
  },
  '@storybook/svelte': {
    webpack5: '@storybook/svelte-webpack5',
    vite: '@storybook/svelte-vite',
  },
  '@storybook/web-components': {
    webpack5: '@storybook/web-components-webpack5',
    vite: '@storybook/web-components-vite',
  },
  '@storybook/html': {
    webpack5: '@storybook/html-webpack5',
    vite: '@storybook/html-vite',
  },
};

const communityFrameworks: { vite: string[]; webpack5: string[] } = {
  vite: ['storybook-framework-qwik', 'storybook-solidjs-vite'],
  webpack5: [],
};

type BuilderType = 'vite' | 'webpack5';

export const getBuilderInfo = (
  mainConfig: StorybookConfig & { builder?: string | Preset },
  dependencies: Record<string, string> = {}
): { name: BuilderType; options: any } => {
  let builderOptions = {};
  let builderName: BuilderType;
  let builderOrFrameworkName = '';

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
    if (typeof framework === 'string') {
      builderOrFrameworkName = framework;
    } else {
      builderOrFrameworkName = framework.name;

      builderOptions = framework.options?.builder || {};
    }
  }

  if (
    builderOrFrameworkName.includes('vite') ||
    dependencies['@storybook/builder-vite'] ||
    dependencies['storybook-builder-vite'] ||
    communityFrameworks.vite.includes(builderOrFrameworkName)
  ) {
    builderName = 'vite';
  } else if (
    builderOrFrameworkName.includes('webpack') ||
    dependencies['@storybook/builder-webpack5'] ||
    dependencies['@storybook/manager-webpack5'] ||
    dependencies['@storybook/builder-webpack4'] ||
    dependencies['@storybook/manager-webpack4'] ||
    communityFrameworks.webpack5.includes(builderOrFrameworkName)
  ) {
    builderName = 'webpack5';
  }

  if (builderName === undefined) {
    logger.info(
      `Builder couldn't be extracted from ${builderOrFrameworkName}. Please report a bug on Github!`
    );
  }

  return {
    name: builderName || 'webpack5',
    options: builderOptions,
  };
};

export type Addon = string | { name: string; options?: Record<string, any> };

export const getNextjsAddonOptions = (addons: Addon[]) => {
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
