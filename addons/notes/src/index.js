import addons from '@storybook/addons';

export { WithNotes } from './react';

export const withNotes = ({ notes }) => {
  const channel = addons.getChannel();

  return getStory => context => {
    // send the notes to the channel before the story is rendered
    channel.emit('storybook/notes/add_notes', notes);
    return getStory(context);
  };
};
