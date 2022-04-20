import { parameters as docsParams } from './dist/esm/docs/config';

export const parameters = { framework: 'web-components', ...docsParams };
export { decorators, argTypesEnhancers } from './dist/esm/docs/config';
export * from './dist/esm/preview/config';
