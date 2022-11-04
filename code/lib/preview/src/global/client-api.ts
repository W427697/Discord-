/* eslint-disable import/namespace */
/* eslint-disable no-underscore-dangle */
import type * as MODULE from '../client-api';

const {
  addArgs,
  addArgsEnhancer,
  addArgTypes,
  addArgTypesEnhancer,
  addDecorator,
  addLoader,
  addParameters,
  addStepRunner,
  ClientApi,
  getQueryParam,
  getQueryParams,
  setGlobalRender,
} = (globalThis as any).__STORYBOOK_MODULE_CLIENT_API__ as typeof MODULE;

export {
  addArgs,
  addArgsEnhancer,
  addArgTypes,
  addArgTypesEnhancer,
  addDecorator,
  addLoader,
  addParameters,
  addStepRunner,
  ClientApi,
  getQueryParam,
  getQueryParams,
  setGlobalRender,
};
