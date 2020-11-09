import { document, FRAMEWORK_OPTIONS } from 'global';
import React, {
  Component,
  FunctionComponent,
  ReactElement,
  StrictMode,
  Fragment,
  createContext,
} from 'react';
import ReactDOM from 'react-dom';

import { StoryFn, StoryContext, RenderContext, DecoratorFunction } from './types';

const rootEl = document ? document.getElementById('root') : null;

const render = (node: ReactElement, el: Element) =>
  new Promise((resolve) => {
    ReactDOM.render(node, el, resolve);
  });

class ErrorBoundary extends Component<{
  showException: (err: Error) => void;
  showMain: () => void;
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

const StoryContextContext = createContext<StoryContext | undefined>(undefined);

export const applyDecorator = (story: StoryFn, decorator: DecoratorFunction) => {
  const Story = story as FunctionComponent<StoryContext>;
  // You cannot override the parameters key, it is fixed
  const BoundStory = (
    { parameters, ...innerStoryContext }: StoryContext | { parameters: {} } = { parameters: {} }
  ) => {
    return (
      <StoryContextContext.Consumer>
        {(storyContext) => <Story {...{ ...storyContext, ...innerStoryContext }} />}
      </StoryContextContext.Consumer>
    );
  };

  return (storyContext: StoryContext) => decorator(BoundStory, storyContext);
};

export const decorateStory = (storyFn: StoryFn, decorators: DecoratorFunction[]) =>
  decorators.reduce(applyDecorator, storyFn);

export default async function renderMain({
  storyContext,
  unboundStoryFn,
  showMain,
  showException,
  forceRender,
}: RenderContext) {
  const Story = unboundStoryFn as FunctionComponent<StoryContext>;

  const content = (
    <StoryContextContext.Provider value={storyContext}>
      <ErrorBoundary showMain={showMain} showException={showException}>
        <Story {...storyContext} />
      </ErrorBoundary>
    </StoryContextContext.Provider>
  );

  // For React 15, StrictMode & Fragment doesn't exists.
  const element = Wrapper ? <Wrapper>{content}</Wrapper> : content;

  // We need to unmount the existing set of components in the DOM node.
  // Otherwise, React may not recreate instances for every story run.
  // This could leads to issues like below:
  // https://github.com/storybookjs/react-storybook/issues/81
  // But forceRender means that it's the same story, so we want too keep the state in that case.
  if (!forceRender) {
    ReactDOM.unmountComponentAtNode(rootEl);
  }

  await render(element, rootEl);
}
