'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.types = undefined;

var _preview = require('./preview');

var _preview2 = _interopRequireDefault(_preview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// define redux actions
var types = exports.types = {
  SELECT_STORY: 'PREVIEW_SELECT_STORY',
  CLEAR_ACTIONS: 'PREVIEW_CLEAR_ACTIONS',
  SET_STORIES: 'PREVIEW_SET_STORIES',
  ADD_ACTION: 'PREVIEW_ADD_ACTION'
};

exports.default = {
  preview: _preview2.default
};