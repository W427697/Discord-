'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.ensureKind = ensureKind;
exports.ensureStory = ensureStory;

exports.default = function () {
  var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var action = arguments[1];

  switch (action.type) {
    case _actions.types.SELECT_STORY:
      {
        // TODO: if action.story is null, we need to select the first story of the
        // given kind.
        var selectedKind = ensureKind(state.stories, action.kind);
        var selectedStory = ensureStory(state.stories, selectedKind, action.story);
        return (0, _extends3.default)({}, state, {
          selectedKind: selectedKind,
          selectedStory: selectedStory
        });
      }

    case _actions.types.CLEAR_ACTIONS:
      {
        return (0, _extends3.default)({}, state, {
          actions: []
        });
      }

    case _actions.types.SET_STORIES:
      {
        var newState = (0, _extends3.default)({}, state, {
          stories: action.stories
        });

        newState.selectedKind = ensureKind(newState.stories, state.kind);
        newState.selectedStory = ensureStory(newState.stories, newState.selectedKind, state.story);

        return newState;
      }

    case _actions.types.ADD_ACTION:
      {
        var actions = [action.action].concat((0, _toConsumableArray3.default)(state.actions || [])).slice(0, 10);

        return (0, _extends3.default)({}, state, {
          actions: actions
        });
      }

    default:
      return state;
  }
};

var _actions = require('../../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ensureKind(storyKinds, selectedKind) {
  var found = storyKinds.find(function (item) {
    return item.kind === selectedKind;
  });
  if (found) return found.kind;
  // if the selected kind is non-existant, select the first kind
  var kinds = storyKinds.map(function (item) {
    return item.kind;
  });
  return kinds[0];
}

function ensureStory(storyKinds, selectedKind, selectedStory) {
  var kindInfo = storyKinds.find(function (item) {
    return item.kind === selectedKind;
  });
  if (!kindInfo) return null;

  var found = kindInfo.stories.find(function (item) {
    return item === selectedStory;
  });
  if (found) return found;

  return kindInfo.stories[0];
}