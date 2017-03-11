var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { types } from './actions';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case types.CLEAR_ERROR:
      {
        return _extends({}, state, {
          error: null
        });
      }

    case types.SET_ERROR:
      {
        return _extends({}, state, {
          error: action.error
        });
      }

    case types.SELECT_STORY:
      {
        return _extends({}, state, {
          selectedKind: action.kind,
          selectedStory: action.story
        });
      }

    case types.SET_INITIAL_STORY:
      {
        const newState = _extends({}, state);
        const { storyKindList } = action;
        if (!newState.selectedKind && storyKindList.length > 0) {
          newState.selectedKind = storyKindList[0].kind;
          newState.selectedStory = storyKindList[0].stories[0];
        }
        return newState;
      }

    default:
      return state;
  }
}