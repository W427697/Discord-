
import { ErrorBoundary, Component, JSXElement } from "solid-js";
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

const renderElement = (node: JSXElement, root: Element) => {
  SolidWeb.render(() => node, root as HTMLElement);
};

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
  const Story = unboundStoryFn as Component<StoryContext<SolidRenderer>>;

  const element = (
    <ErrorBoundary fallback={err => {
      showException(err);
      return err
    }}>      
      <>
        <Story {...storyContext} />
        {showMain()}
      </>
    </ErrorBoundary>
  );

  renderElement(element, canvasElement); 
}
