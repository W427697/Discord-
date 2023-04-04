import { defaultDecorateStory } from '@storybook/preview-api';
import type { LegacyStoryFn, DecoratorFunction } from '@storybook/types';

import type { ReactRenderer } from './types';
import { jsxDecorator } from './docs/jsxDecorator';

export const applyDecorators = (
  storyFn: LegacyStoryFn<ReactRenderer>,
  decorators: DecoratorFunction<ReactRenderer>[]
): LegacyStoryFn<ReactRenderer> => {
  // @ts-ignore
  const jsxIndex = decorators.findIndex((d) => d.originalFn === jsxDecorator);

  const reorderedDecorators =
    jsxIndex === -1 ? decorators : [...decorators.splice(jsxIndex, 1), ...decorators];

  return defaultDecorateStory(storyFn, reorderedDecorators);
};
