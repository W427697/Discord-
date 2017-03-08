'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _storybookUi = require('@kadira/storybook-ui');

var _storybookAddons = require('@kadira/storybook-addons');

var _storybookAddons2 = _interopRequireDefault(_storybookAddons);

var _storybookChannelPostmsg = require('@kadira/storybook-channel-postmsg');

var _storybookChannelPostmsg2 = _interopRequireDefault(_storybookChannelPostmsg);

var _preview = require('./preview');

var _preview2 = _interopRequireDefault(_preview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global location */
/* eslint class-methods-use-this: 0 */

var ReactProvider = function (_Provider) {
  _inherits(ReactProvider, _Provider);

  function ReactProvider() {
    _classCallCheck(this, ReactProvider);

    var _this = _possibleConstructorReturn(this, (ReactProvider.__proto__ || Object.getPrototypeOf(ReactProvider)).call(this));

    _this.channel = (0, _storybookChannelPostmsg2.default)({ page: 'manager' });
    _storybookAddons2.default.setChannel(_this.channel);
    return _this;
  }

  _createClass(ReactProvider, [{
    key: 'getPanels',
    value: function getPanels() {
      return _storybookAddons2.default.getPanels();
    }
  }, {
    key: 'renderPreview',
    value: function renderPreview(selectedKind, selectedStory) {
      var queryParams = {
        selectedKind: selectedKind,
        selectedStory: selectedStory
      };

      // Add the react-perf query string to the iframe if that present.
      if (/react_perf/.test(location.search)) {
        queryParams.react_perf = '1';
      }

      var queryString = _qs2.default.stringify(queryParams);
      var url = 'iframe.html?' + queryString;
      return _react2.default.createElement(_preview2.default, { url: url });
    }
  }, {
    key: 'handleAPI',
    value: function handleAPI(api) {
      var _this2 = this;

      api.onStory(function (kind, story) {
        _this2.channel.emit('setCurrentStory', { kind: kind, story: story });
      });
      this.channel.on('setStories', function (data) {
        api.setStories(data.stories);
      });
      this.channel.on('selectStory', function (data) {
        api.selectStory(data.kind, data.story);
      });
      this.channel.on('applyShortcut', function (data) {
        api.handleShortcut(data.event);
      });
      _storybookAddons2.default.loadAddons(api);
    }
  }]);

  return ReactProvider;
}(_storybookUi.Provider);

exports.default = ReactProvider;