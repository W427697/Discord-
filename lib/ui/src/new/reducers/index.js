const initialState = {
  stories: [],
  ui: {
    showSearchBox: false,
    showLeftPanel: true,
    showDownPanel: false,
    showShortcutsHelp: false,
    selectedKind: '',
    selectedStory: '',
    storyFilter: '',
    name: 'STORYBOOK',
    url: 'https://github.com/storybooks/storybook',
  },
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_STORIES': {
      return {
        ...state,
        stories: action.stories,
      };
    }
    case 'TOGGLE_SEARCHBOX': {
      return {
        ...state,
        ui: {
          ...state.ui,
          showSearchBox: action.value || !state.ui.showSearchBox,
        },
      };
    }
    case 'CHANGE_STORYFILTER': {
      return {
        ...state,
        ui: {
          ...state.ui,
          storyFilter: action.filter,
        },
      };
    }
    case 'SELECT_STORY': {
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedKind: action.kind,
          selectedStory: action.story,
        },
      };
    }
    case 'TOGGLE_SHORTCUTSHELP': {
      return {
        ...state,
        ui: {
          ...state.ui,
          showShortcutsHelp: action.value || !state.ui.showShortcutsHelp,
        },
      };
    }
    default:
      return state;
  }
};

export default appReducer;
