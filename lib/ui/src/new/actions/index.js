import { TOGGLE_FULLSCREEN, TOGGLE_SHORTCUTSHELP, TOGGLE_SEARCHBOX } from '../constants/actions';

const findNewSelectedStory = ({ stories }, kind, story) => {
  let newKind = kind;
  let newStory = story;

  if (!kind) {
    newKind = stories[0].kind;
  }

  if (!story) {
    const matchingStories = stories
      .filter(s => s.kind.indexOf(newKind) >= 0)
      .filter(s => s.stories && s.stories.length > 0)
      .sort((a, b) => a.kind.length - b.kind.length);

    newStory = matchingStories ? matchingStories[0].stories[0] : '';
    newKind = matchingStories[0].kind;
  }

  return {
    newKind,
    newStory,
  };
};

export const loadStories = stories => {
  return (dispatch, getState) => {
    dispatch({
      type: 'LOAD_STORIES',
      stories,
    });

    const { selectedKind, selectedStory } = getState().ui;
    const { newKind, newStory } = findNewSelectedStory(getState(), selectedKind, selectedStory);

    if (selectedKind !== newKind || selectedStory !== newStory) {
      dispatch({
        type: 'SELECT_STORY',
        kind: newKind,
        story: newStory,
      });
    }
  };
};

export const toggleFullScreen = value => ({
  type: TOGGLE_FULLSCREEN,
  value,
});

export const toggleSearchBox = value => ({
  type: TOGGLE_SEARCHBOX,
  value,
});

export const changeStoryFilter = filter => ({
  type: 'CHANGE_STORYFILTER',
  filter,
});

export const selectStory = (kind, story) => {
  return (dispatch, getState) => {
    const { newKind, newStory } = findNewSelectedStory(getState(), kind, story);

    dispatch({
      type: 'SELECT_STORY',
      kind: newKind,
      story: newStory,
    });
  };
};

export const toggleShortcutsHelp = value => ({
  type: TOGGLE_SHORTCUTSHELP,
  value,
});

export const selectPanel = panelName => ({
  type: 'SELECT_PANEL',
  panelName,
});
