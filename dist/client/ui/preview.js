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

var _react2 = _interopRequireDefault(_react);

var _redboxReact = require('redbox-react');

var _redboxReact2 = _interopRequireDefault(_redboxReact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Represents a functional component that renders a placeholder
 * when there's no preview available.
 */
var NoPreview = function NoPreview() {
  return _react2.default.createElement(
    'p',
    null,
    'No Preview Available!'
  );
};

/**
 * Represents a component that renders a story preview.
 */

var Preview = function (_React$Component) {
  (0, _inherits3.default)(Preview, _React$Component);

  function Preview() {
    (0, _classCallCheck3.default)(this, Preview);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Preview).call(this));

    _this.state = { data: null };
    return _this;
  }

  (0, _createClass3.default)(Preview, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      this.setState({ data: this.props.syncedStore.getData() });

      this.props.syncedStore.watchData(function (data) {
        return _this2.setState({ data: data });
      });
    }
  }, {
    key: 'renderError',
    value: function renderError(error) {
      var realError = new Error(error.message);
      realError.stack = error.stack;

      return _react2.default.createElement(_redboxReact2.default, { error: realError });
    }
  }, {
    key: 'renderPreview',
    value: function renderPreview(data) {
      var selectedKind = data.selectedKind;
      var selectedStory = data.selectedStory;


      var story = this.props.storyStore.getStory(selectedKind, selectedStory);

      return story ? story() : _react2.default.createElement(NoPreview, null);
    }
  }, {
    key: 'render',
    value: function render() {
      var data = this.state.data;

      return data.error ? this.renderError(data.error) : this.renderPreview(data);
    }
  }]);
  return Preview;
}(_react2.default.Component);

exports.default = Preview;


Preview.propTypes = {
  syncedStore: _react2.default.PropTypes.object.isRequired,
  storyStore: _react2.default.PropTypes.object.isRequired
};