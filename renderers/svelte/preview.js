import { parameters as docsParams } from './dist/esm/docs/config';

export const parameters = { framework: 'svelte', ...docsParams };
export { decorators, argTypesEnhancers } from './dist/esm/docs/config';
export * from './dist/esm/preview/config';
