import type { Addon_DecoratorFunction } from '@storybook/core/dist/types';
import { withMeasure } from './withMeasure';
import { PARAM_KEY } from './constants';

export const decorators: Addon_DecoratorFunction[] = [withMeasure];

export const globals = {
  [PARAM_KEY]: false,
};
