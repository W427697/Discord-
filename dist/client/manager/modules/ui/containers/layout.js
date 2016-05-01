'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composer = undefined;

var _layout = require('../components/layout');

var _layout2 = _interopRequireDefault(_layout);

var _mantraCore = require('mantra-core');

var _lodash = require('lodash.pick');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var composer = exports.composer = function composer(_ref, onData) {
  var context = _ref.context;

  var _context = context();

  var reduxStore = _context.reduxStore;


  var processState = function processState() {
    var _reduxStore$getState = reduxStore.getState();

    var shortcuts = _reduxStore$getState.shortcuts;

    var data = (0, _lodash2.default)(shortcuts, 'showLeftPanel', 'showDownPanel', 'goFullScreen');
    onData(null, data);
  };

  processState();
  reduxStore.subscribe(processState);
};

exports.default = (0, _mantraCore.composeAll)((0, _mantraCore.compose)(composer), (0, _mantraCore.useDeps)())(_layout2.default);