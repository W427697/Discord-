'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var iframeStyle = {
  width: '100%',
  height: '100%',
  border: 0,
  margin: 0,
  padding: 0
};

var Preview = function (_Component) {
  _inherits(Preview, _Component);

  function Preview() {
    _classCallCheck(this, Preview);

    return _possibleConstructorReturn(this, (Preview.__proto__ || Object.getPrototypeOf(Preview)).apply(this, arguments));
  }

  _createClass(Preview, [{
    key: 'shouldComponentUpdate',

    /* eslint-disable class-methods-use-this */
    value: function shouldComponentUpdate() {
      // When the manager is re-rendered, due to changes in the layout (going full screen / changing
      // addon panel to right) Preview section will update. If its re-rendered the whole html page
      // inside the html is re-rendered making the story to re-mount.
      // We dont have to re-render this component for any reason since changes are communicated to
      // story using the channel and necessary changes are done by it.
      return false;
    }
    /* eslint-enable class-methods-use-this */

  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('iframe', {
        id: 'storybook-preview-iframe',
        style: iframeStyle,
        src: this.props.url
      });
    }
  }]);

  return Preview;
}(_react.Component);

Preview.propTypes = {
  url: _react2.default.PropTypes.string
};

exports.default = Preview;