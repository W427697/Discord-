import type { Addon_DecoratorFunction } from '@storybook/core/dist/types';
import { withLinks } from './index';

export const decorators: Addon_DecoratorFunction[] = [withLinks];
