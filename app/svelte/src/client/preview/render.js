import { document } from 'global';
import { stripIndents } from 'common-tags';
import { logger } from '@storybook/client-logger';

import Preview from '../components/Preview.svelte';

let previousComponent = null;

function cleanUpPreviousStory() {
  if (!previousComponent) {
    return;
  }
  try {
    previousComponent.$destroy();
  } catch (err) {
    logger.warn('Failed to destroy previous component', err);
  }
  previousComponent = null;
}

function mountView({ Component, target, props, on, Wrapper, WrapperData }) {
  let component;

  if (Wrapper) {
    const fragment = document.createDocumentFragment();
    component = new Component({ target: fragment, props });

    const wrapper = new Wrapper({
      target,
      slots: { default: fragment },
      props: WrapperData || {},
    });
    component.$on('destroy', () => {
      wrapper.$destroy(true);
    });
  } else {
    component = new Component({ target, props });
  }

  if (on) {
    // Attach svelte event listeners.
    Object.keys(on).forEach(eventName => {
      component.$on(eventName, on[eventName]);
    });
  }

  previousComponent = component;
}

function renderDefault(
  story,
  {
    // storyFn,
    selectedKind,
    selectedStory,
    showMain,
    showError,
    // showException,
  }
) {
  cleanUpPreviousStory();

  const {
    /** @type {SvelteComponent} */
    Component,
    /** @type {any} */
    props,
    /** @type {{[string]: () => {}}} Attach svelte event handlers */
    on,
    Wrapper,
    WrapperData,
  } = story;

  const DefaultCompatComponent = Component ? Component.default || Component : undefined;
  const DefaultCompatWrapper = Wrapper ? Wrapper.default || Wrapper : undefined;

  if (!DefaultCompatComponent) {
    showError({
      title: `Expecting a Svelte component from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Did you forget to return the Svelte component configuration from the story?
        Use "() => ({ Component: YourComponent, data: {} })"
        when defining the story.
      `,
    });

    return;
  }

  const target = document.getElementById('root');

  target.innerHTML = '';

  mountView({
    Component: DefaultCompatComponent,
    target,
    props,
    on,
    Wrapper: DefaultCompatWrapper,
    WrapperData,
  });

  showMain();
}

function renderCsf(
  StoryPreview,
  { selectedKind, selectedStory, showMain, showError, showException }
) {
  cleanUpPreviousStory();

  const target = document.getElementById('root');

  target.innerHTML = '';

  try {
    previousComponent = new StoryPreview({ target });
    showMain();
  } catch (ex) {
    showException(ex);
    // cleanup
    cleanUpPreviousStory();
  }
}

export default function render(config) {
  const story = config.storyFn();
  const isSvelteComponent = typeof story === 'function';
  const renderer = isSvelteComponent ? renderCsf : renderDefault;
  return renderer(story, config);
}
