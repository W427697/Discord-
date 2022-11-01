/* eslint-disable no-underscore-dangle */
import type * as CLIENT_API from '../client-api';

const {
  ClientApi,
  addArgTypes,
  addArgTypesEnhancer,
  addArgs,
  addArgsEnhancer,
  addDecorator,
  addLoader,
  addParameters,
  addStepRunner,
  getQueryParam,
  getQueryParams,
  setGlobalRender,
} = (globalThis as any).__STORYBOOK_MODULE_CLIENT_API__ as typeof CLIENT_API;

export {
  ClientApi,
  addArgTypes,
  addArgTypesEnhancer,
  addArgs,
  addArgsEnhancer,
  addDecorator,
  addLoader,
  addParameters,
  addStepRunner,
  getQueryParam,
  getQueryParams,
  setGlobalRender,
};
