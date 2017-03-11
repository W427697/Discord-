'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reducer;

var _actions = require('./actions');

function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case _actions.types.CLEAR_ERROR:
      {
        return _extends({}, state, {
          error: null
        });
      }

    case _actions.types.SET_ERROR:
      {
        return _extends({}, state, {
          error: action.error
        });
      }

    case _actions.types.SELECT_STORY:
      {
        return _extends({}, state, {
          selectedKind: action.kind,
          selectedStory: action.story
        });
      }

    case _actions.types.SET_INITIAL_STORY:
      {
        var newState = _extends({}, state);
        var storyKindList = action.storyKindList;

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