import type { Preset, StorybookConfig } from '@storybook/types';

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

export const getBuilderInfo = (
  mainConfig: StorybookConfig & { builder?: string | Preset }
): { name: 'vite' | 'webpack5'; options: any } => {
  let builderOptions = {};
  let builderName = 'webpack5';

  const { core = {}, framework } = mainConfig;
  const { builder } = core;

  if (builder) {
    if (typeof builder === 'string') {
      builderName = builder.includes('vite') ? 'vite' : 'webpack5';
    } else {
      builderName = builder.name.includes('vite') ? 'vite' : 'webpack5';
      builderOptions = builder.options || {};
    }
  } else if (framework) {
    if (typeof framework === 'string') {
      builderName = framework.includes('vite') ? 'vite' : 'webpack5';
    } else {
      builderName = framework.name.includes('vite') ? 'vite' : 'webpack5';
      builderOptions = framework.options?.builder || {};
    }
  }

  return {
    name: builderName as 'vite' | 'webpack5',
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
