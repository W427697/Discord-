"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

exports.default = function (bus, reduxStore, actions) {
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

    bus.emit(dataId + ".setCurrentStory", (0, _stringify2.default)(payload));
  });

  // watch pageBus and put both actions and stories.
  bus.on(dataId + ".addAction", function (payload) {
    var data = JSON.parse(payload);
    actions.preview.addAction(data.action);
  });

  bus.on(dataId + ".setStories", function (payload) {
    var data = JSON.parse(payload);
    actions.preview.setStories(data.stories);
  });

  bus.on(dataId + ".selectStory", function (payload) {
    var data = JSON.parse(payload);
    actions.preview.selectStory(data.kind, data.story);
  });

  bus.on(dataId + ".applyShortcut", function (payload) {
    var data = JSON.parse(payload);
    actions.shortcuts.handleEvent(data.event);
  });
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }