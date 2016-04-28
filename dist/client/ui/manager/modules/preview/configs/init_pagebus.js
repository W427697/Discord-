'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.default = function (bus, reduxStore) {
  var state = reduxStore.getState();
  var dataId = state.core.dataId;

  // subscribe to redux store and send down changes to pageBus.
  reduxStore.subscribe(function () {
    var _reduxStore$getState = reduxStore.getState();

    var preview = _reduxStore$getState.preview;

    if (!preview) return;

    var payload = {
      kind: preview.selectedKind,
      story: preview.selectedStory
    };

    bus.emit(dataId + '.currentStory', (0, _stringify2.default)(payload));
  });

  // watch pageBus and put both actions and stories.
  bus.on(dataId + '.action', function (payload) {
    var action = JSON.parse(payload);
    reduxStore.dispatch({
      type: _actions.types.ADD_ACTION,
      action: action
    });
  });

  bus.on(dataId + '.stories', function (payload) {
    var stories = JSON.parse(payload);
    reduxStore.dispatch({
      type: _actions.types.SET_STORIES,
      stories: stories
    });
  });
};

var _actions = require('../actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }