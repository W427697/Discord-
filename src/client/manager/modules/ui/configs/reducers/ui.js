import { types } from '../../actions';

export default function (state = {}, action) {
  switch (action.type) {
    case types.SET_STORY_FILTER: {
      return {
        ...state,
        storyFilter: action.filter
      };
    }

    default:
      return state;
  }
}
