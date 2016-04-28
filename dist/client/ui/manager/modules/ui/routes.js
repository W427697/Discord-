'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (injectDeps) {
  var InjectedLayout = injectDeps(_layout2.default);
  var rootEl = document.getElementById('root');

  var root = _react2.default.createElement(InjectedLayout, {
    leftPanel: function leftPanel() {
      return 'leftPanel';
    },
    preview: function preview() {
      return 'preview';
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }