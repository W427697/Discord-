import { document } from 'global';
import axe from 'axe-core';
import deprecate from 'util-deprecate';
import addons, { makeDecorator } from '@storybook/addons';
import { STORY_RENDERED } from '@storybook/core-events';
import EVENTS, { PARAM_KEY } from './constants';

let progress = Promise.resolve();
let options;

const getElement = () => {
  const storyRoot = document.getElementById('story-root');

  if (storyRoot) {
    return storyRoot.children;
  }
  return document.getElementById('root');
};

const report = input => {
  addons.getChannel().emit(EVENTS.RESULT, input);
};

const run = ({ element, ...o }) => {
  progress = progress.then(() => {
    axe.reset();
    if (o) {
      axe.configure(o);
    }
    return axe.run(element || getElement()).then(report);
  });
};

let subscribed = false;
const runWithOptions = () => run(options || {});

export const withA11Y = makeDecorator({
  name: 'withA11Y',
  parameterName: PARAM_KEY,
  skipIfNoParametersOrOptions: false,
  allowDeprecatedUsage: false,

  wrapper: (getStory, context, opt) => {
    options = opt.parameters || opt.options;

    if (!subscribed) {
      subscribed = true;
      addons.getChannel().on(STORY_RENDERED, runWithOptions);
      addons.getChannel().on(EVENTS.REQUEST, runWithOptions);
    }

    return getStory(context);
  },
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

// REMOVE at 6.0.0
export const checkA11y = deprecate(
  (...args) => withA11Y(...args),
  'checkA11y has been replaced with withA11Y'
);
