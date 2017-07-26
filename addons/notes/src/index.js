import addons from '@storybook/addons';

import { ReactDecorator } from './react';

const wrapper = ({ notes }) => {
  const channel = addons.getChannel();

  return getStory => context => {
    // send the notes to the channel before the story is rendered
    channel.emit('storybook/notes/add_notes', notes);
    return getStory(context);
  };
};

export { wrapper as with };

/* legacy */
export { ReactDecorator as WithNotes };
