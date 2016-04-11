'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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

var DocgenReader = function (_Component) {
    (0, _inherits3.default)(DocgenReader, _Component);

    function DocgenReader() {
        (0, _classCallCheck3.default)(this, DocgenReader);
        return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(DocgenReader).apply(this, arguments));
    }

    (0, _createClass3.default)(DocgenReader, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                null,
                'DocgenReader',
                _react2.default.createElement(
                    'div',
                    { style: { backgroundColor: 'white', padding: '20px 10px' } },
                    _react2.default.createElement(
                        'h2',
                        null,
                        this.props.docgenData.displayName
                    ),
                    _react2.default.createElement(
                        'p',
                        null,
                        this.props.docgenData.description
                    ),
                    _react2.default.createElement(
                        'h3',
                        null,
                        'Props:'
                    ),
                    _react2.default.createElement('hr', null),
                    (0, _keys2.default)(this.props.docgenData.props).map(function (key) {
                        var prop = _this2.props.docgenData.props[key];

                        return _react2.default.createElement(
                            'div',
                            { key: key, style: { padding: '5px' } },
                            _this2.renderPropTitle(key, prop),
                            _react2.default.createElement(
                                'h5',
                                null,
                                'Type: ',
                                prop.type.name
                            ),
                            _this2.renderPropDefaulValue(prop),
                            _react2.default.createElement(
                                'p',
                                null,
                                prop.description
                            ),
                            _react2.default.createElement('hr', null)
                        );
                    })
                )
            );
        }
    }, {
        key: 'renderPropTitle',
        value: function renderPropTitle(propName, propObj) {
            return _react2.default.createElement(
                'h4',
                null,
                propName,
                propObj.required ? _react2.default.createElement(
                    'span',
                    { style: { color: 'red' } },
                    ' - REQUIRED'
                ) : null
            );
        }
    }, {
        key: 'renderPropDefaulValue',
        value: function renderPropDefaulValue(propObj) {

            return propObj.defaultValue ? _react2.default.createElement(
                'h5',
                null,
                'Default Value: ',
                propObj.defaultValue.value
            ) : null;
        }
    }]);
    return DocgenReader;
}(_react.Component);

exports.default = DocgenReader;


DocgenReader.propTypes = {
    docgenData: _react.PropTypes.object.isRequired
};