import { global } from '@storybook/global';
import type { FC } from 'react';
import React, { Component as ReactComponent, StrictMode, Fragment } from 'react';
import { renderElement, unmountElement } from '@storybook/react-dom-shim';

import type { RenderContext } from '@storybook/core/dist/types';

import type { ReactRenderer, StoryContext } from './types';

const { FRAMEWORK_OPTIONS } = global;

class ErrorBoundary extends ReactComponent<{
  showException: (err: Error) => void;
  showMain: () => void;
  children?: React.ReactNode;
}> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidMount() {
    const { hasError } = this.state;
    const { showMain } = this.props;
    if (!hasError) {
      showMain();
    }
  }

  componentDidCatch(err: Error) {
    const { showException } = this.props;
    // message partially duplicates stack, strip it
    showException(err);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    return hasError ? null : children;
  }
}

const Wrapper = FRAMEWORK_OPTIONS?.strictMode ? StrictMode : Fragment;

export async function renderToCanvas(
  {
    storyContext,
    unboundStoryFn,
    showMain,
    showException,
    forceRemount,
  }: RenderContext<ReactRenderer>,
  canvasElement: ReactRenderer['canvasElement']
) {
  const Story = unboundStoryFn as FC<StoryContext<ReactRenderer>>;

  const content = (
    <ErrorBoundary showMain={showMain} showException={showException}>
      <Story {...storyContext} />
    </ErrorBoundary>
  );

  // For React 15, StrictMode & Fragment doesn't exists.
  const element = Wrapper ? <Wrapper>{content}</Wrapper> : content;

  // In most cases, we need to unmount the existing set of components in the DOM node.
  // Otherwise, React may not recreate instances for every story run.
  // This could leads to issues like below:
  // https://github.com/storybookjs/react-storybook/issues/81
  // (This is not the case when we change args or globals to the story however)
  if (forceRemount) {
    unmountElement(canvasElement);
  }

  await renderElement(element, canvasElement, storyContext?.parameters?.react?.rootOptions);

  return () => unmountElement(canvasElement);
}
