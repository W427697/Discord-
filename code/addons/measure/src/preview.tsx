import type { Addon_DecoratorFunction } from '@storybook/core/dist/modules/types/index';
import { withMeasure } from './withMeasure';
import { PARAM_KEY } from './constants';

export const decorators: Addon_DecoratorFunction[] = [withMeasure];

export const globals = {
  [PARAM_KEY]: false,
};
