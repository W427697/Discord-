import ReactDOM from 'react-dom';
import addons, { makeDecorator } from '@storybook/addons';
import { REGISTER_SUBSCRIPTION, STORY_CHANGED } from '@storybook/core-events';
import { document } from 'global';

let node = document.createElement('div');

const unmount = () => {
  ReactDOM.unmountComponentAtNode(node);
  node = document.createElement('div');
};

const subscription = () => {
  const channel = addons.getChannel();
  channel.on(STORY_CHANGED, unmount);
  return () => {
    unmount();
    channel.removeListener(STORY_CHANGED, unmount);
  };
};

export default makeDecorator({
  name: 'withReact',
  parameterName: 'framework',
  wrapper: (getStory, context, { parameters }) => {
    const story = getStory(context);
    if (parameters !== 'react') {
      return story;
    }

    const channel = addons.getChannel();
    channel.emit(REGISTER_SUBSCRIPTION, subscription);
    ReactDOM.render(story, node);
    return node;
  },
});
