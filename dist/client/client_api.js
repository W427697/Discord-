'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withState = exports.WithState = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ClientApi = function () {
  function ClientApi(_ref) {
    var syncedStore = _ref.syncedStore;
    var storyStore = _ref.storyStore;
    (0, _classCallCheck3.default)(this, ClientApi);

    this._syncedStore = syncedStore;
    this._storyStore = storyStore;
  }

  (0, _createClass3.default)(ClientApi, [{
    key: 'storiesOf',
    value: function storiesOf(kind, m) {
      var _this = this;

      if (m && m.hot) {
        m.hot.dispose(function () {
          _this._storyStore.removeStoryKind(kind);
        });
      }

      var add = function add(storyName, fn) {
        _this._storyStore.addStory(kind, storyName, fn);
        return { add: add };
      };

      return { add: add };
    }
  }, {
    key: 'action',
    value: function action(name) {
      var syncedStore = this._syncedStore;

      return function () {
        for (var _len = arguments.length, _args = Array(_len), _key = 0; _key < _len; _key++) {
          _args[_key] = arguments[_key];
        }

        var args = (0, _from2.default)(_args);

        var _syncedStore$getData = syncedStore.getData();

        var _syncedStore$getData$ = _syncedStore$getData.actions;
        var actions = _syncedStore$getData$ === undefined ? [] : _syncedStore$getData$;

        // Remove events from the args. Otherwise, it creates a huge JSON string.

        if (args[0] && args[0].constructor && /Synthetic/.test(args[0].constructor.name)) {
          args[0] = '[' + args[0].constructor.name + ']';
        }

        actions = [{ name: name, args: args }].concat(actions.slice(0, 4));
        syncedStore.setData({ actions: actions });
      };
    }
  }]);
  return ClientApi;
}();

exports.default = ClientApi;

var WithState = exports.WithState = function (_Component) {
  (0, _inherits3.default)(WithState, _Component);

  function WithState(props) {
    (0, _classCallCheck3.default)(this, WithState);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(WithState).call(this, props));

    _this2.state = {};
    return _this2;
  }

  (0, _createClass3.default)(WithState, [{
    key: 'render',
    value: function render() {
      var _this3 = this;

      var handlers = this.props.handlers;

      var child = this.props.children;

      var props = (0, _assign2.default)({}, this.state);

      var _loop = function _loop(act) {
        var prop = handlers[act];
        props[act] = function (v) {
          if (typeof child.props[act] === 'function') {
            child.props[act](v);
          }
          _this3.setState((0, _defineProperty3.default)({}, prop, v));
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

WithState.propTypes = {
  children: _react.PropTypes.object.isRequired
};

var withState = exports.withState = function withState(handlers, renderChildren) {
  return function () {
    return _react2.default.createElement(
      WithState,
      { handlers: handlers },
      renderChildren()
    );
  };
};