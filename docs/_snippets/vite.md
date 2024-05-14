```js filename=".storybook/main.js" renderer="common" language="js" tabTitle="vite"
export default {
  // Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve?.alias,
        // 👇 External module
        lodash: require.resolve('./lodash.mock'),
        // 👇 Internal modules
        '@/api': path.resolve(__dirname, './api.mock.ts'),
        '@/app/actions': path.resolve(__dirname, './app/actions.mock.ts'),
        '@/lib/session': path.resolve(__dirname, './lib/session.mock.ts'),
        '@/lib/db': path.resolve(__dirname, './lib/db.mock.ts'),
      };
    }

    return config;
  },
};
```

```ts filename=".storybook/main.ts" renderer="common" language="ts" tabTitle="vite"
// Replace your-framework with the framework you are using (e.g., react-webpack5, vue3-vite)
import type { StorybookConfig } from '@storybook/your-framework';

const config: StorybookConfig = {
  framework: '@storybook/your-framework',
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  viteFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve?.alias,
        // 👇 External module
        lodash: require.resolve('./lodash.mock'),
        // 👇 Internal modules
        '@/api': path.resolve(__dirname, './api.mock.ts'),
        '@/app/actions': path.resolve(__dirname, './app/actions.mock.ts'),
        '@/lib/session': path.resolve(__dirname, './lib/session.mock.ts'),
        '@/lib/db': path.resolve(__dirname, './lib/db.mock.ts'),
      };
    }

    return config;
  },
};

export default config;
```

```js filename="vitest.config.js" renderer="react" language="js" tabTitle="vite"
import { defineConfig } from 'vitest/config';
import { mergeConfig } from 'vite';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      clearMocks: true,
      setupFiles: './src/setupTests.js', //👈 Our configuration file enabled here
    },
  }),
);
```

```ts filename="vitest.config.ts" renderer="react" language="ts" tabTitle="vite"
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { mergeConfig } from 'vite';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      clearMocks: true,
      setupFiles: './src/setupTests.ts', //👈 Our configuration file enabled here
    },
  }),
);
```

```js filename="vitest.config.js" renderer="vue" language="js" tabTitle="vite"
import { defineConfig } from 'vitest/config';
import { mergeConfig } from 'vite';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      clearMocks: true,
      setupFiles: './src/setupTests.js', //👈 Our configuration file enabled here
    },
  }),
);
```

```ts filename="vitest.config.ts" renderer="vue" language="ts" tabTitle="vite"
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { mergeConfig } from 'vite';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      clearMocks: true,
      setupFiles: './src/setupTests.ts', //👈 Our configuration file enabled here
    },
  }),
);
```

