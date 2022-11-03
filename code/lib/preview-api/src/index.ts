import * as ADDONS from '@storybook/addons';
import * as CLIENT_API from '@storybook/client-api';
import * as CORE_CLIENT from '@storybook/core-client';
import * as PREVIEW_WEB from '@storybook/preview-web';
import * as STORE from '@storybook/store';

/**
 * HOOKS API
 */
export const {
  useArgs,
  useCallback,
  useChannel,
  useEffect,
  useGlobals,
  useMemo,
  useParameter,
  useReducer,
  useRef,
  useState,
  useStoryContext,
  HooksContext,
} = ADDONS;

/**
 * DECORATORS API
 */
export const { makeDecorator } = ADDONS;

/**
 * STORIES API
 */
export const {
  addArgTypes,
  addArgTypesEnhancer,
  addArgs,
  addArgsEnhancer,
  addDecorator,
  addLoader,
  addParameters,
  addStepRunner,
} = CLIENT_API;
export const { getQueryParam, getQueryParams } = CLIENT_API;
export const { setGlobalRender } = CLIENT_API;

export const {
  combineArgs,
  combineParameters,
  composeConfigs,
  composeStepRunners,
  composeStories,
  composeStory,
  decorateStory,
  defaultDecorateStory,
  prepareStory,
  normalizeStory,
} = STORE;

/**
 * STORIES API
 */
export const { ClientApi } = CLIENT_API;
export const { StoryStore } = STORE;
export const { Preview, PreviewWeb } = PREVIEW_WEB;
export const { start } = CORE_CLIENT;
