import { types } from './';

export default {
  setStoryFilter({ reduxStore }, filter) {
    reduxStore.dispatch({
      type: types.SET_STORY_FILTER,
      filter
    });
  }
};
