import { TOGGLE_FULLSCREEN, TOGGLE_SHORTCUTSHELP, TOGGLE_SEARCHBOX } from '../constants/actions';

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
    default:
      return state;
  }
};

export default appReducer;
