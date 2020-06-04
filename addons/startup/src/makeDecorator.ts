import addons, { makeDecorator } from '@storybook/addons';
import { PARAM_KEY, STORY_SELECTED_EVENT } from './constants';

export const withStartup = makeDecorator({
  name: 'withStartup',
  parameterName: PARAM_KEY,
  skipIfNoParametersOrOptions: false,
  wrapper: (getStory, context) => {
    console.log('rendering');
    const story = getStory(context);
    console.log('rendered');
    addons.getChannel().emit(STORY_SELECTED_EVENT, { foo: 3 });
    console.log('emitted');
    return story;
  },
});
