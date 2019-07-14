import ReactDOM from 'react-dom';
import { makeDecorator, StoryContext, StoryGetter } from '@storybook/addons';
import { hookify, useEffect, useMemo } from '@storybook/client-api';
import { document } from 'global';

import './globals';
import render from './render';

const withReact = hookify((getStory: StoryGetter, context: StoryContext) => {
  const node = useMemo(() => document.createElement('div'), [context.kind, context.name]);
  useEffect(() => () => ReactDOM.unmountComponentAtNode(node), [node]);
  render(getStory(context), node, context);
  return node;
});

export default makeDecorator({
  name: 'withReact',
  parameterName: 'framework',
  wrapper: (getStory, context, { parameters }) =>
    parameters === 'react' ? withReact(getStory, context) : getStory(context),
});

export { render };
