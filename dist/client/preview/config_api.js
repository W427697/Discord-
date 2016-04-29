'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ConfigApi = function () {
  function ConfigApi(_ref) {
    var pageBus = _ref.pageBus;
    var storyStore = _ref.storyStore;
    var reduxStore = _ref.reduxStore;
    (0, _classCallCheck3.default)(this, ConfigApi);

    this._pageBus = pageBus;
    this._storyStore = storyStore;
    this._reduxStore = reduxStore;
  }

  (0, _createClass3.default)(ConfigApi, [{
    key: '_renderMain',
    value: function _renderMain(loaders) {
      if (loaders) loaders();

      var storyKindList = this._storyStore.dumpStoryBook();
      // send to the parent frame.
      this._pageBus.emit('setStories', (0, _stringify2.default)(storyKindList));

      // clear the error if exists.
      this._reduxStore.dispatch({
        type: _actions.types.CLEAR_ERROR
      });
      this._reduxStore.dispatch({
        type: _actions.types.SET_INITIAL_STORY,
        storyKindList: storyKindList
      });
    }
  }, {
    key: '_renderError',
    value: function _renderError(e) {
      var stack = e.stack;
      var message = e.message;

      var error = { stack: stack, message: message };

      this._reduxStore.dispatch({
        type: _actions.types.SET_ERROR,
        error: error
      });
    }
  }, {
    key: 'configure',
    value: function configure(loaders, module) {
      var _this = this;

      var render = function render() {
        try {
          _this._renderMain(loaders);
        } catch (error) {
          _this._renderError(error);
        }
      };

      if (module.hot) {
        module.hot.accept(function () {
          setTimeout(render);
        });
      }

      render();
    }
  }]);
  return ConfigApi;
}();

exports.default = ConfigApi;