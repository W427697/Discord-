'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

var _reducers = require('./configs/reducers');

var _reducers2 = _interopRequireDefault(_reducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  routes: _routes2.default,
  actions: _actions2.default,
  reducers: _reducers2.default,
  load: function load() {}
};