const initialState = [];

const storiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_STORIES':
      return action.stories;
    default:
      return state;
  }
};

export default storiesReducer;
