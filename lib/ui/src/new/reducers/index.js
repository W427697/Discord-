import {
  TOGGLE_FULLSCREEN,
  TOGGLE_LEFTPANEL,
  TOGGLE_SHORTCUTSHELP,
  TOGGLE_SEARCHBOX,
  TOGGLE_DOWNPANEL,
  TOGGLE_DOWNPANEL_INRIGHT,
  TOGGLE_NEXT_STORY,
  TOGGLE_PREV_STORY,
} from '../constants/actions';

const initialState = {
  stories: [],
  panels: [],
  ui: {
    showSearchBox: false,
    showLeftPanel: true,
    showDownPanel: true,
    downPanelInRight: false,
    goFullScreen: false,
    showShortcutsHelp: false,
    selectedPanel: '',
    selectedKind: '',
    selectedStory: '',
    storyFilter: '',
    name: 'STORYBOOK',
    url: 'https://github.com/storybooks/storybook',
  },
  plugins: {
    viewport: {},
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
    case TOGGLE_FULLSCREEN: {
      return {
        ...state,
        ui: {
          ...state.ui,
          goFullScreen: action.value || !state.ui.goFullScreen,
        },
      };
    }
    case TOGGLE_SEARCHBOX: {
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
    case TOGGLE_SHORTCUTSHELP: {
      return {
        ...state,
        ui: {
          ...state.ui,
          showShortcutsHelp: action.value || !state.ui.showShortcutsHelp,
        },
      };
    }
    case 'SELECT_PANEL': {
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedPanel: action.panelName,
        },
      };
    }
    case TOGGLE_LEFTPANEL: {
      return {
        ...state,
        ui: {
          ...state.ui,
          showLeftPanel: action.value || !state.ui.showLeftPanel,
        },
      };
    }
    case TOGGLE_DOWNPANEL: {
      return {
        ...state,
        ui: {
          ...state.ui,
          showDownPanel: action.value || !state.ui.showDownPanel,
        },
      };
    }
    case TOGGLE_DOWNPANEL_INRIGHT: {
      return {
        ...state,
        ui: {
          ...state.ui,
          downPanelInRight: action.value || !state.ui.downPanelInRight,
        },
      };
    }
    case TOGGLE_NEXT_STORY: {
      const i = state.stories.findIndex(s => s.kind === state.ui.selectedKind);
      const j = state.stories[i].stories.findIndex(s => s === state.ui.selectedStory);

      let newKind = state.ui.selectedKind;
      let newStory = state.ui.selectedStory;

      if (j < state.stories[i].stories.length - 1) {
        newStory = state.stories[i].stories[j + 1];
      } else if (i < state.stories.length - 1) {
        newKind = state.stories[i + 1].kind;
        newStory = state.stories[i + 1].stories[0];
      }

      return {
        ...state,
        ui: {
          ...state.ui,
          selectedKind: newKind,
          selectedStory: newStory,
        },
      };
    }
    case TOGGLE_PREV_STORY: {
      const i = state.stories.findIndex(s => s.kind === state.ui.selectedKind);
      const j = state.stories[i].stories.findIndex(s => s === state.ui.selectedStory);

      let newKind = state.ui.selectedKind;
      let newStory = state.ui.selectedStory;

      if (j > 0) {
        newStory = state.stories[i].stories[j - 1];
      } else if (i > 0) {
        newKind = state.stories[i - 1].kind;
        newStory = state.stories[i - 1].stories[state.stories[i - 1].stories.length - 1];
      }

      return {
        ...state,
        ui: {
          ...state.ui,
          selectedKind: newKind,
          selectedStory: newStory,
        },
      };
    }
    default:
      return state;
  }
};

export default appReducer;
