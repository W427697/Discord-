import { types } from './';

export default {
  selectStory({ reduxStore }, kind, story) {
    // update this on the redux
    reduxStore.dispatch({
      type: types.SELECT_STORY,
      kind,
      story,
    });
  },

  clearActions({ reduxStore }) {
    // simply clear actions in the redux store
    reduxStore.dispatch({
      type: types.CLEAR_ACTIONS,
    });
  },
};
