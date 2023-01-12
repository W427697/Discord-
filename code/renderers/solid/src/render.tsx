import type { Component } from 'solid-js';
import { ErrorBoundary, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import { render as solidRender } from 'solid-js/web';
import type { RenderContext, ArgsStoryFn, Args } from '@storybook/types';
import type { SolidRenderer, StoryContext } from './types';

/**
 * SolidJS store for handling fine grained updates
 * of the story args.
 */
const [store, setStore] = createStore({
  args: {} as Args,
});

/**
 * Default render function for a story definition (inside a csf file) without
 * a render function. e.g:
 * ```typescript
 * export const StoryExample = {
 *  args: {
 *    disabled: true,
 *    children: "Hello World",
 *  },
 * };
 * ```
 */
export const render: ArgsStoryFn<SolidRenderer> = (args, context) => {
  const { id, component: Component } = context;
  if (!Component) {
    throw new Error(
      `Unable to render story ${id} as the component annotation is missing from the default export`
    );
  }

  return <Component {...args} />;
};

/**
 * Dispose function for re-rendering the whole SolidJS app
 * when a story (storyId) is changed / remounted.
 */
let disposeStory: (() => void) | undefined;

/**
 * Main renderer function for initializing the SolidJS app
 * with the story content.
 */
export async function renderToCanvas(
  {
    unboundStoryFn,
    storyContext,
    showMain,
    showException,
    forceRemount,
    setArgsMappers,
  }: RenderContext<SolidRenderer>,
  canvasElement: SolidRenderer['canvasElement']
) {
  /**
   * forceRemount occurs when loading by first time the story, it
   * will dispose the story (clear the root node) for rendering the
   * new loaded story.
   */
  if (forceRemount && disposeStory) disposeStory();

  /**
   * If the story is not forced to be re-mounted (re-rendered)
   * The storyContext is handled by a solid store for manipulating
   * the component state when a property from controls is changed.
   */
  if (!forceRemount) {
    setStore('args', storyContext.args);
    return;
  }

  const Story = unboundStoryFn as Component<StoryContext<SolidRenderer>>;

  const App: Component = () => {
    setArgsMappers([
      (args) => {
        setStore('args', args);
        return store.args;
      },
    ]);

    onMount(() => {
      showMain();
    });

    return (
      <ErrorBoundary
        fallback={(err) => {
          showException(err);
          return err;
        }}
      >
        <Story {...storyContext} />
      </ErrorBoundary>
    );
  };

  disposeStory = solidRender(() => <App />, canvasElement as HTMLElement);
}
