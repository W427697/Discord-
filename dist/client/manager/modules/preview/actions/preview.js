'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ = require('./');

exports.default = {
  setStories: function setStories(_ref, stories) {
    var reduxStore = _ref.reduxStore;

    reduxStore.dispatch({
      type: _.types.SET_STORIES,
      stories: stories
    });
  },
  selectStory: function selectStory(_ref2, kind, story) {
    var reduxStore = _ref2.reduxStore;

    reduxStore.dispatch({
      type: _.types.SELECT_STORY,
      kind: kind,
      story: story
    });
  },
  clearActions: function clearActions(_ref3) {
    var reduxStore = _ref3.reduxStore;

    reduxStore.dispatch({
      type: _.types.CLEAR_ACTIONS
    });
  },
  addAction: function addAction(_ref4, action) {
    var reduxStore = _ref4.reduxStore;

    reduxStore.dispatch({
      type: _.types.ADD_ACTION,
      action: action
    });
  }
};