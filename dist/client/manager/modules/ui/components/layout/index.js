'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _vsplit = require('./vsplit');

var _vsplit2 = _interopRequireDefault(_vsplit);

var _hsplit = require('./hsplit');

var _hsplit2 = _interopRequireDefault(_hsplit);

var _reactSplitPane = require('@kadira/react-split-pane');

var _reactSplitPane2 = _interopRequireDefault(_reactSplitPane);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rootStyles = {
  height: '100vh',
  backgroundColor: '#F7F7F7'
};

var leftPanelStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%'
};

var downPanelStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  padding: '5px 10px 10px 0',
  boxSizing: 'border-box'
};

var contentPanelStyle = {
  position: 'absolute',
  boxSizing: 'border-box',
  width: '100%',
  height: '100%',
  padding: '10px 10px 10px 0'
};

var previewStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: '#FFF',
  border: '1px solid #ECECEC',
  borderRadius: 4
};

var vsplit = _react2.default.createElement(_vsplit2.default, null);
var hsplit = _react2.default.createElement(_hsplit2.default, null);

var onDragStart = function onDragStart() {
  document.body.classList.add('dragging');
};

var onDragEnd = function onDragEnd() {
  document.body.classList.remove('dragging');
};

var Layout = function Layout(props) {
  return _react2.default.createElement(
    'div',
    { style: rootStyles },
    _react2.default.createElement(
      _reactSplitPane2.default,
      {
        split: 'vertical',
        minSize: 250,
        resizerChildren: vsplit,
        onDragStarted: onDragStart,
        onDragFinished: onDragEnd
      },
      _react2.default.createElement(
        'div',
        { style: leftPanelStyle },
        props.leftPanel()
      ),
      _react2.default.createElement(
        _reactSplitPane2.default,
        {
          split: 'horizontal',
          primary: 'second',
          minSize: 100,
          defaultSize: 200,
          resizerChildren: hsplit,
          onDragStarted: onDragStart,
          onDragFinished: onDragEnd
        },
        _react2.default.createElement(
          'div',
          { style: contentPanelStyle },
          _react2.default.createElement(
            'div',
            { style: previewStyle },
            props.preview()
          )
        ),
        _react2.default.createElement(
          'div',
          { style: downPanelStyle },
          props.downPanel()
        )
      )
    )
  );
};

Layout.propTypes = {
  leftPanel: _react2.default.PropTypes.func.isRequired,
  preview: _react2.default.PropTypes.func.isRequired,
  downPanel: _react2.default.PropTypes.func.isRequired
};

exports.default = Layout;