import { document } from 'global';
import axe, { ElementContext, RunOptions, Spec } from 'axe-core';

export interface Setup {
  element?: ElementContext;
  config: Spec;
  options: RunOptions;
  manual: boolean;
}

const getElement = () => {
  const storyRoot = document.getElementById('story-root');

  if (storyRoot) {
    return storyRoot.children;
  }
  return document.getElementById('root');
};

const run = async (input: Setup) => {
  const {
    element = getElement(),
    config,
    options = {
      restoreScroll: true,
    },
  } = input;
  await axe.reset();
  if (config) {
    await axe.configure(config);
  }
  return axe.run(element, options);
};

export default run;
