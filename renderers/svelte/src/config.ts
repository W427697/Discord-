import { parameters as docsParams } from './docs/config';

export const parameters = { framework: 'svelte', ...docsParams };
export { decorators, argTypesEnhancers } from './docs/config';
export * from './preview/config';
