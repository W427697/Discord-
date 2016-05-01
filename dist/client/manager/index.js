'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _redux = require('redux');

var _mantraCore = require('mantra-core');

var _context = require('./configs/context.js');

var _context2 = _interopRequireDefault(_context);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _ui = require('./modules/ui');

var _ui2 = _interopRequireDefault(_ui);

var _preview = require('./modules/preview');

var _preview2 = _interopRequireDefault(_preview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dataId = _uuid2.default.v4();

var reducer = (0, _redux.combineReducers)((0, _extends3.default)({
  core: function core() {
    return { dataId: dataId };
  }
}, _preview2.default.reducers, _ui2.default.reducers));

var reduxStore = (0, _redux.createStore)(reducer);

var context = (0, _context2.default)(reduxStore);
var app = (0, _mantraCore.createApp)(context);
app.loadModule(_ui2.default);
app.loadModule(_preview2.default);
app.init();