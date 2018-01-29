import addons from '@storybook/addons';

export const withSingleReadMe = content => {
  const channel = addons.getChannel();
  return getStory => context => {
    // send the notes to the channel before the story is rendered
    channel.emit('storybook/readme/add_readme', content);
    return getStory(context);
  };
};

export const withReadMe = content => (storyFn, context) => {
  const channel = addons.getChannel();
  channel.emit('storybook/readme/add_readme', content);
  return storyFn(context);
};
