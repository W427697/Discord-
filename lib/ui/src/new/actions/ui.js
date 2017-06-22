export const toggleSearchBox = value => ({
  type: 'TOGGLE_SEARCHBOX',
  value,
});

export const changeStoryFilter = filter => ({
  type: 'CHANGE_STORYFILTER',
  filter,
});

export const selectStory = (kind, story) => {
  return (dispatch, getState) => {
    const { stories } = getState();

    let newKind = kind;
    let newStory = story;
    if (story === null) {
      const matchingStories = stories
        .filter(s => s.kind.indexOf(kind) >= 0)
        .filter(s => s.stories && s.stories.length > 0)
        .sort((a, b) => a.kind.length - b.kind.length);

      newStory = matchingStories ? matchingStories[0].stories[0] : '';
      newKind = matchingStories[0].kind;
    }

    dispatch({
      type: 'SELECT_STORY',
      kind: newKind,
      story: newStory,
    });
  };
};
