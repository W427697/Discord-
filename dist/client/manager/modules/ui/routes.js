'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (injectDeps) {
  var InjectedLayout = injectDeps(_layout2.default);
  var rootEl = document.getElementById('root');

  var root = _react2.default.createElement(InjectedLayout, {
    leftPanel: function leftPanel() {
      return _react2.default.createElement(_left_panel2.default, null);
    },
    preview: function preview() {
      return _react2.default.createElement(_preview2.default, null);
    },
    downPanel: function downPanel() {
      return 'downPanel';
    }
  });
  _reactDom2.default.render(root, rootEl);
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _layout = require('./components/layout');

var _layout2 = _interopRequireDefault(_layout);

var _preview = require('../preview/containers/preview');

var _preview2 = _interopRequireDefault(_preview);

var _left_panel = require('./containers/left_panel');

var _left_panel2 = _interopRequireDefault(_left_panel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }