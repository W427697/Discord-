import type { Addon_DecoratorFunction } from '@storybook/core/dist/types';
import { withOutline } from './withOutline';
import { PARAM_KEY } from './constants';

export const decorators: Addon_DecoratorFunction[] = [withOutline];

export const globals = {
  [PARAM_KEY]: false,
};
