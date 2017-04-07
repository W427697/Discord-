'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* globals location */

var _actions = require('./actions');

var _ = require('./');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConfigApi = function () {
  function ConfigApi(_ref) {
    var channel = _ref.channel,
        storyStore = _ref.storyStore,
        reduxStore = _ref.reduxStore;

    _classCallCheck(this, ConfigApi);

    // channel can be null when running in node
    // always check whether channel is available
    this._channel = channel;
    this._storyStore = storyStore;
    this._reduxStore = reduxStore;
  }

  _createClass(ConfigApi, [{
    key: '_renderMain',
    value: function _renderMain(loaders) {
      if (loaders) loaders();

      var stories = this._storyStore.dumpStoryBook();
      // send to the parent frame.
      this._channel.emit('setStories', { stories: stories });

      // clear the error if exists.
      this._reduxStore.dispatch((0, _actions.clearError)());
      this._reduxStore.dispatch((0, _actions.setInitialStory)(stories));
    }
  }, {
    key: '_renderError',
    value: function _renderError(e) {
      var stack = e.stack,
          message = e.message;

      var error = { stack: stack, message: message };
      this._reduxStore.dispatch((0, _actions.setError)(error));
    }
  }, {
    key: 'configure',
    value: function configure(loaders, module) {
      var _this = this;

      var render = function render() {
        try {
          _this._renderMain(loaders);
        } catch (error) {
          if (module.hot && module.hot.status() === 'apply') {
            // We got this issue, after webpack fixed it and applying it.
            // Therefore error message is displayed forever even it's being fixed.
            // So, we'll detect it reload the page.
            location.reload();
          } else {
            // If we are accessing the site, but the error is not fixed yet.
            // There we can render the error.
            _this._renderError(error);
          }
        }
      };

      if (module.hot) {
        module.hot.accept(function () {
          setTimeout(render);
        });
        module.hot.dispose(function () {
          (0, _.clearDecorators)();
        });
      }

      if (this._channel) {
        render();
      } else {
        loaders();
      }
    }
  }]);

  return ConfigApi;
}();

exports.default = ConfigApi;