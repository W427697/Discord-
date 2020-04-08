import { document, window } from 'global';
import { STORY_CHANGED, STORY_RENDERED } from '@storybook/core-events';
import axe, { ElementContext, RunOptions, Spec } from 'axe-core';
import addons from '@storybook/addons';
import { EVENTS } from './constants';

interface Setup {
  element?: ElementContext;
  config: Spec;
  options: RunOptions;
}

export interface A11yParameters extends Setup {
  manual?: boolean;
}

const channel = addons.getChannel();
let active = false;

const getElement = () => {
  const storyRoot = document.getElementById('story-root');
  return storyRoot ? storyRoot.children : document.getElementById('root');
};

const run = async (storyId: string) => {
  try {
    const { manual, ...input } = getParams(storyId);

    if (!active) {
      active = true;
      channel.emit(EVENTS.REQUEST);
      const {
        element = getElement(),
        config,
        options = {
          restoreScroll: true,
        },
      } = input;
      axe.reset();
      if (config) {
        axe.configure(config);
      }

      const result = await axe.run(element, options);
      channel.emit(EVENTS.RESULT, result);
    }
  } catch (error) {
    channel.emit(EVENTS.ERROR, error);
  } finally {
    active = false;
  }
};

const getParams = (storyId: string): A11yParameters => {
  // eslint-disable-next-line no-undef, no-underscore-dangle
  const { parameters } = window.__STORYBOOK_STORY_STORE__._stories[storyId] || {};
  return parameters.a11y;
};

const runIfNeeded = (storyId: string) => {
  const { manual } = getParams(storyId);
  if (!manual) {
    run(storyId);
  }
};

channel.on(STORY_CHANGED, runIfNeeded);
channel.on(STORY_RENDERED, runIfNeeded);
channel.on(EVENTS.MANUAL, run);
