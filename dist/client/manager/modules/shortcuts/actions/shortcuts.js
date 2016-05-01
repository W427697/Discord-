'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ = require('./');

exports.default = {
  handleEvent: function handleEvent(_ref, event) {
    var reduxStore = _ref.reduxStore;

    reduxStore.dispatch({
      type: _.types.HANDLE_EVENT,
      event: event
    });
  }
};