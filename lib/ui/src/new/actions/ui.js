export const toggleSearchBox = value => ({
  type: 'TOGGLE_SEARCHBOX',
  value,
});

export const changeStoryFilter = filter => ({
  type: 'CHANGE_STORYFILTER',
  filter,
});

export const selectStory = (kind, story) => ({
  type: 'SELECT_STORY',
  kind,
  story,
});
