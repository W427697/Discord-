'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _header = require('./header');

var _header2 = _interopRequireDefault(_header);

var _stories = require('./stories');

var _stories2 = _interopRequireDefault(_stories);

var _lodash = require('lodash.pick');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mainStyle = {
  padding: 20
};

var storyProps = ['stories', 'selectedKind', 'selectedStory', 'onSelectStory'];

var LeftPanel = function LeftPanel(props) {
  return _react2.default.createElement(
    'div',
    { style: mainStyle },
    _react2.default.createElement(_header2.default, null),
    props.stories ? _react2.default.createElement(_stories2.default, (0, _lodash2.default)(props, storyProps)) : null
  );
};

LeftPanel.propTypes = {
  stories: _react2.default.PropTypes.array,
  selectedKind: _react2.default.PropTypes.string,
  selectedStory: _react2.default.PropTypes.string,
  onSelectStory: _react2.default.PropTypes.func
};

exports.default = LeftPanel;