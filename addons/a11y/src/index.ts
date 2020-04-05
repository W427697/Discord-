import { DecoratorFunction } from '@storybook/addons';

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

export const withA11y: DecoratorFunction = (storyFn, storyContext) => {
  return storyFn(storyContext);
};
