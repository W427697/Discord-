import { parameters as docsParams } from './docs/config';

export const parameters = { framework: 'web-components', ...docsParams };
export { decorators, argTypesEnhancers } from './docs/config';
export * from './preview/config';
