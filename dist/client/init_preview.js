'use strict';

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _reactDom = require('react-dom');

var ReactDOM = _interopRequireWildcard(_reactDom);

var _preview = require('./ui/preview');

var _preview2 = _interopRequireDefault(_preview);

var _ = require('./');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var rootEl = document.getElementById('root');
var syncedStore = (0, _.getSyncedStore)();
var storyStore = (0, _.getStoryStore)();

ReactDOM.render(React.createElement(_preview2.default, { syncedStore: syncedStore, storyStore: storyStore }), rootEl);