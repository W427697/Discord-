import { parameters as docsParams } from './dist/esm/docs/config';

export const parameters = { framework: 'html', ...docsParams };
export { decorators } from './dist/esm/docs/config';
export * from './dist/esm/preview/config';
