import { document } from 'global';
import { stripIndents } from 'common-tags';

import PreviewRenderer from '../components/PreviewRenderer.svelte';

const previousElement = null;
let previousComponent = null;

const cleanUpPreviousStory = () => {
  if (previousComponent) {
    previousComponent.$destroy();
    previousComponent = null;
  }
};

const applyDomWrappers = (root, domWrappers = []) =>
  domWrappers.reduceRight((node, wrapper) => wrapper(node), root);

const clearNode = node => {
  // eslint-disable-next-line no-param-reassign
  node.innerHTML = '';
};

export default function render({
  storyFn,
  selectedKind,
  selectedStory,
  showMain,
  showError,
  showException,
}) {
  // Signature of storyFn's result:
  //
  // {
  //   Component,
  //   props,
  //   // NOTE event listeners are added AFTER the component has been instanciated,
  //   // so any event that fires from the component's "constructor" will be missed
  //   on,
  //
  //   // 0+ wrapper components
  //   wrappers: [
  //     {
  //       Component,
  //       props,
  //     },
  //     // or, shortcut:
  //     Component,
  //     ...
  //   ],
  //
  //   // 0+ DOM wrappers
  //   domWrappers: [
  //     targetNode => newTargetNode,
  //     ...
  //   ],
  // }
  //
  // Wrapper components are mainly useful to end users, to add context around
  // their stories with decorators.
  //
  // DOM wrappers are more intended for usage by other addons, to facilitate
  // support of Svelte without having to bundle actual Svelte components.
  //
  // Wrappers are applied right to left, so that wrappers added last (that is,
  // the wrappers added by the more general decorators) are outermost.
  //
  // DOM wrappers are first applied right to left from the root node. Then the
  // rightmost wrapper component in rendered to the resulting node. Subsequent
  // wrapper components and, eventually, the story components are rendered in
  // turn in the previous wrapper's slot. The whole wrapper chain, except the
  // first one, is unwrapped in Svelte's context, by our PreviewRenderer component.
  //
  // Each wrapper component is expected to have a default <slot /> for this to work.
  //
  const { domWrappers, ...story } = storyFn();

  cleanUpPreviousStory();

  const root = document.getElementById('root');

  clearNode(root);

  // guard: missing target component
  if (!story.Component) {
    showError({
      title: `Expecting a Svelte component from the story: "${selectedStory}" of "${selectedKind}".`,
      description: stripIndents`
        Did you forget to return the Svelte component configuration from the story?
        Use "() => ({ Component, props })" when defining the story.
      `,
    });
  }

  const target = applyDomWrappers(root, domWrappers);

  try {
    previousComponent = new PreviewRenderer({
      target,
      props: {
        story,
        selectedKind,
        selectedStory,
      },
    });
    showMain();
  } catch (error) {
    showException(error);
  }
}
