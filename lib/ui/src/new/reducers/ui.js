const initialState = {
  showSearchBox: false,
  showLeftPanel: true,
  showDownPanel: false,
  selectedKind: '',
  selectedStory: '',
  storyFilter: '',
  name: 'STORYBOOK',
  url: 'https://github.com/storybooks/storybook',
};

const storiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_SEARCHBOX': {
      return {
        ...state,
        showSearchBox: action.value || !state.showSearchBox,
      };
    }
    case 'CHANGE_STORYFILTER': {
      return {
        ...state,
        storyFilter: action.filter,
      };
    }
    case 'SELECT_STORY': {
      return {
        ...state,
        selectedKind: action.kind,
        selectedStory: action.story,
      };
    }
    default:
      return state;
  }
};

export default storiesReducer;
