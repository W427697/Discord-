'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ = require('./');

exports.default = {
  selectStory: function selectStory(_ref, kind, story) {
    var reduxStore = _ref.reduxStore;

    // update this on the redux
    reduxStore.dispatch({
      type: _.types.SELECT_STORY,
      kind: kind,
      story: story
    });
  },
  clearActions: function clearActions(_ref2) {
    var reduxStore = _ref2.reduxStore;

    // simply clear actions in the redux store
    reduxStore.dispatch({
      type: _.types.CLEAR_ACTIONS
    });
  }
};