import addons from '@storybook/addons';
import { STORY_SELECTED_EVENT } from './constants';

export const withStartup = (storyFn: any) => {
  const story = storyFn();
  console.log('emitting');
  addons.getChannel().emit(STORY_SELECTED_EVENT, { foo: 3 });
  return story;
};
