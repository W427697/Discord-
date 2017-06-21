const initialState = {
  showSearchBox: false,
  showLeftPanel: true,
  showDownPanel: false,
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
    default:
      return state;
  }
};

export default storiesReducer;
