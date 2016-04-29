'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

var _reducers = require('./configs/reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _pageBus = require('page-bus');

var _pageBus2 = _interopRequireDefault(_pageBus);

var _init_pagebus = require('./configs/init_pagebus');

var _init_pagebus2 = _interopRequireDefault(_init_pagebus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  reducers: _reducers2.default,
  actions: _actions2.default,
  load: function load(_ref) {
    var reduxStore = _ref.reduxStore;

    var bus = (0, _pageBus2.default)();
    (0, _init_pagebus2.default)(bus, reduxStore);
  }
};