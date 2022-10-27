// eslint-disable-next-line import/no-cycle
import { parameters as docsParams } from './docs/config';

export const parameters = { framework: 'html' as const, ...docsParams };
// eslint-disable-next-line import/no-cycle
export { decorators, argTypesEnhancers } from './docs/config';
export { renderToDOM, render } from './render';
