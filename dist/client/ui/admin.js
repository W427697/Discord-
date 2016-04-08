'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var React = _interopRequireWildcard(_react);

var _controls = require('./controls');

var _controls2 = _interopRequireDefault(_controls);

var _layout = require('./layout');

var _layout2 = _interopRequireDefault(_layout);

var _action_logger = require('./action_logger');

var _action_logger2 = _interopRequireDefault(_action_logger);

var _jsonStringifySafe = require('json-stringify-safe');

var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Represents the core admin view.
 */

var Admin = function (_React$Component) {
  (0, _inherits3.default)(Admin, _React$Component);

  function Admin() {
    (0, _classCallCheck3.default)(this, Admin);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Admin).apply(this, arguments));
  }

  (0, _createClass3.default)(Admin, [{
    key: 'renderControls',
    value: function renderControls() {
      var data = this.props.data;

      return React.createElement(_controls2.default, {
        storyStore: data.storyStore,
        selectedKind: data.selectedKind,
        selectedStory: data.selectedStory,
        onKind: this.props.onKindSelected,
        onStory: this.props.onStorySelected
      });
    }
  }, {
    key: 'renderIframe',
    value: function renderIframe() {
      var data = this.props.data;

      var iframeStyle = {
        width: '100%',
        height: '100%',
        border: '1px solid #ECECEC',
        borderRadius: 4,
        backgroundColor: '#FFF'
      };

      // We need to send dataId via queryString
      // That's how our data layer can start communicate via the iframe.
      var queryString = 'dataId=' + data.dataId;

      return React.createElement('iframe', {
        style: iframeStyle,
        src: '/iframe?' + queryString
      });
    }
  }, {
    key: 'renderActionLogger',
    value: function renderActionLogger() {
      var _props$data$actions = this.props.data.actions;
      var actions = _props$data$actions === undefined ? [] : _props$data$actions;

      var log = actions.map(function (action) {
        return (0, _jsonStringifySafe2.default)(action, null, 2);
      }).join('\n\n');

      return React.createElement(_action_logger2.default, { actionLog: log, onClear: this.props.onActionsCleared });
    }
  }, {
    key: 'render',
    value: function render() {
      var controls = this.renderControls();
      var iframe = this.renderIframe();
      var actionLogger = this.renderActionLogger();

      return React.createElement(_layout2.default, {
        controls: controls,
        preview: iframe,
        actionLogger: actionLogger
      });
    }
  }]);
  return Admin;
}(React.Component);

exports.default = Admin;


Admin.propTypes = {
  data: React.PropTypes.object.isRequired,
  onStorySelected: React.PropTypes.func,
  onKindSelected: React.PropTypes.func,
  onActionsCleared: React.PropTypes.func
};