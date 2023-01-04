
import { ErrorBoundary, Component, JSXElement, onMount } from "solid-js";
import { createStore } from "solid-js/store"
import * as SolidWeb from "solid-js/web";
import type { RenderContext, ArgsStoryFn } from '@storybook/types';
import type { SolidRenderer, StoryContext } from './types';

export const render: ArgsStoryFn<SolidRenderer> = (args, context) => {
  const { id, component: Component } = context;
  if (!Component) { 
    throw new Error(
      `Unable to render story ${id} as the component annotation is missing from the default export`
    );
  }

  return <Component {...args} />;
};

const [store, setStore] = createStore({ storyContext: {} as any });
let disposeStory: (() => void) | undefined;

export async function renderToCanvas(
  {
    storyContext,
    unboundStoryFn,
    showMain,
    showException,
    forceRemount,
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
    setStore("storyContext", storyContext);
    return;
  }

  const Story = unboundStoryFn as Component<StoryContext<SolidRenderer>>;

  const FakeStory: Component<{children?: JSXElement}> = (props) => {
    console.log("Rendered!");
    return <div style="color: yellow">
      {props.children}
    </div>
  }

  const Wrapper: Component = () => {        
    setStore("storyContext", storyContext);

    onMount(() => {
      showMain();
    })

    return <ErrorBoundary fallback={err => {
      showException(err);
      return err
    }}>      
      <FakeStory {...store.storyContext.args} />
    </ErrorBoundary>
  }

  disposeStory = SolidWeb.render(() => <Wrapper />, canvasElement as HTMLElement);
}
