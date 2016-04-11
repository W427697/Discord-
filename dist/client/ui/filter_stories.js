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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FilterText = function (_React$Component) {
  (0, _inherits3.default)(FilterText, _React$Component);

  function FilterText(props) {
    (0, _classCallCheck3.default)(this, FilterText);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(FilterText).call(this, props));
  }

  (0, _createClass3.default)(FilterText, [{
    key: 'onChange',
    value: function onChange(event) {
      var filterText = event.target.value;
      this.props.onChange(filterText);
    }
  }, {
    key: 'render',
    value: function render() {
      var mainStyle = {
        border: '1px solid #C1C1C1',
        borderRadius: '2px'
      };

      var filterTextWrapStyle = {
        background: '#F7F7F7',
        paddingRight: '24px'
      };

      var filterTextStyle = {
        fontSize: '15px',
        color: '#828282',
        border: 'none',
        padding: '5px',
        display: 'block',
        width: '100%',
        height: '30px',
        boxSizing: 'border-box',
        outline: 'none'
      };

      var clearButtonStyle = {
        position: 'absolute',
        border: 'none',
        padding: '5px',
        width: '25px',
        height: '30px',
        lineHeight: '20px',
        margin: '0 0 10px 0',
        right: '0px',
        top: '0px',
        textAlign: 'center',
        boxSizing: 'border-box',
        cursor: 'pointer'
      };

      return _react2.default.createElement(
        'div',
        { style: mainStyle },
        _react2.default.createElement(
          'div',
          { style: filterTextWrapStyle },
          _react2.default.createElement('input', {
            style: filterTextStyle,
            type: 'text',
            placeholder: 'Filter',
            name: 'filter-text',
            value: this.props.filterText,
            onChange: this.onChange.bind(this)
          })
        ),
        _react2.default.createElement(
          'div',
          {
            style: clearButtonStyle,
            onClick: this.props.onClear
          },
          'x'
        )
      );
    }
  }]);
  return FilterText;
}(_react2.default.Component);

exports.default = FilterText;


FilterText.propTypes = {
  filterText: _react2.default.PropTypes.string,
  onChange: _react2.default.PropTypes.func,
  onClear: _react2.default.PropTypes.func
};