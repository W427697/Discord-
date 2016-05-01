'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composer = undefined;

var _action_logger = require('../components/action_logger');

var _action_logger2 = _interopRequireDefault(_action_logger);

var _mantraCore = require('mantra-core');

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

    var data = {
      onClear: actionMap.preview.clearActions,
      actions: []
    };

    if (preview && preview.actions) {
      data.actions = preview.actions;
    }

    onData(null, data);
  };

  processState();
  reduxStore.subscribe(processState);
};

exports.default = (0, _mantraCore.composeAll)((0, _mantraCore.compose)(composer), (0, _mantraCore.useDeps)())(_action_logger2.default);