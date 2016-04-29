'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composer = undefined;

var _preview = require('../components/preview.js');

var _preview2 = _interopRequireDefault(_preview);

var _mantraCore = require('mantra-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var composer = exports.composer = function composer(_ref, onData) {
  var context = _ref.context;

  var _context = context();

  var reduxStore = _context.reduxStore;
  // Here we are sure that, Redux store initialize with the dataId.
  // So that's why don't need to subscribe here.

  var state = reduxStore.getState();
  var url = 'iframe.html?dataId=' + state.core.dataId;
  onData(null, { url: url });
};

exports.default = (0, _mantraCore.composeAll)((0, _mantraCore.compose)(composer), (0, _mantraCore.useDeps)())(_preview2.default);