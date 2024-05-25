import type { SupportedFrameworks, SupportedRenderers } from '@storybook/types';

export const frameworkToRenderer: Record<
  SupportedFrameworks | SupportedRenderers,
  SupportedRenderers | 'vue'
> = {
  // frameworks
  angular: 'angular',
  ember: 'ember',
  'html-vite': 'html',
  'html-webpack5': 'html',
  nextjs: 'react',
  'preact-vite': 'preact',
  'preact-webpack5': 'preact',
  qwik: 'qwik',
  'react-vite': 'react',
  'react-webpack5': 'react',
  'server-webpack5': 'server',
  solid: 'solid',
  'svelte-vite': 'svelte',
  'svelte-webpack5': 'svelte',
  sveltekit: 'svelte',
  'vue3-vite': 'vue3',
  'vue3-webpack5': 'vue3',
  nuxt: 'vue3',
  'web-components-vite': 'web-components',
  'web-components-webpack5': 'web-components',
  // renderers
  html: 'html',
  preact: 'preact',
  'react-native': 'react-native',
  react: 'react',
  server: 'server',
  svelte: 'svelte',
  vue3: 'vue3',
  'web-components': 'web-components',
};
