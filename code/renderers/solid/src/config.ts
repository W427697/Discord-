import { parameters as docsParams } from './docs/config';

export const parameters = { framework: 'solid', ...docsParams };

export { decorators, argTypesEnhancers } from './docs/config';
export { renderToCanvas, render } from './render';
