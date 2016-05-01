'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composer = undefined;

var _left_panel = require('../components/left_panel');

var _left_panel2 = _interopRequireDefault(_left_panel);

var _mantraCore = require('mantra-core');

var _lodash = require('lodash.pick');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var composer = exports.composer = function composer(_ref, onData) {
  var context = _ref.context;
  var actions = _ref.actions;

  var _context = context();

  var reduxStore = _context.reduxStore;

  var actionMap = actions();

  var processState = function processState() {
    var _reduxStore$getState = reduxStore.getState();

    var preview = _reduxStore$getState.preview;

    if (preview) {
      var data = (0, _lodash2.default)(preview, 'stories', 'selectedStory', 'selectedKind');
      data.onSelectStory = actionMap.preview.selectStory;
      onData(null, data);
    } else {
      onData(null, {});
    }
  };

  processState();
  reduxStore.subscribe(processState);
};

exports.default = (0, _mantraCore.composeAll)((0, _mantraCore.compose)(composer), (0, _mantraCore.useDeps)())(_left_panel2.default);