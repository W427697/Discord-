import { parameters as docsParams } from './dist/esm/docs/config';

export const parameters = { framework: 'vue3', ...docsParams };
export { argTypesEnhancers } from './dist/esm/docs/config';
export * from './dist/esm/preview/config';
