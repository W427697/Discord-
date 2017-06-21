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
    const { stories, ui: { selectedKind } } = getState();

    let newKind = kind;
    if (selectedKind === kind && story === null) {
      newKind = kind.substring(0, kind.lastIndexOf('/'));
    }

    let newStory = story;
    if (story === null) {
      const matchingStories = stories
        .filter(s => s.kind.indexOf(kind) >= 0)
        .filter(s => s.stories && s.stories.length > 0);

      newStory = matchingStories ? matchingStories[0].stories[0] : null;
    }

    dispatch({
      type: 'SELECT_STORY',
      kind: newKind,
      story: newStory,
    });
  };
};
