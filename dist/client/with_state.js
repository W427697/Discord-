'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WithState = function (_Component) {
  (0, _inherits3.default)(WithState, _Component);

  function WithState(props) {
    (0, _classCallCheck3.default)(this, WithState);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(WithState).call(this, props));

    _this.state = {};
    return _this;
  }

  (0, _createClass3.default)(WithState, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var handlers = this.props.handlers;

      var child = this.props.children;

      var props = (0, _assign2.default)({}, this.state);

      var _loop = function _loop(act) {
        var prop = handlers[act];
        props[act] = function (v) {
          if (typeof child.props[act] === 'function') {
            child.props[act](v);
          }
          _this2.setState((0, _defineProperty3.default)({}, prop, v));
        };
      };

      for (var act in handlers) {
        _loop(act);
      }
      return _react2.default.cloneElement(child, props);
    }
  }]);
  return WithState;
}(_react.Component);

exports.default = WithState;


WithState.propTypes = {
  children: _react.PropTypes.object.isRequired
};