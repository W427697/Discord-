import { parameters as previewParams } from './dist/esm/preview/config';
import { parameters as docsParams } from './dist/esm/docs/config';

export const parameters = { ...previewParams, ...docsParams };
export { decorators, argTypesEnhancers } from './dist/esm/docs/config';
