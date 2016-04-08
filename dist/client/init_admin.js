'use strict';

var _reactRouter = require('react-router');

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _reactDom = require('react-dom');

var ReactDOM = _interopRequireWildcard(_reactDom);

var _app = require('./ui/app');

var _app2 = _interopRequireDefault(_app);

var _storybook_route_handler = require('./ui/storybook_route_handler');

var _storybook_route_handler2 = _interopRequireDefault(_storybook_route_handler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var rootEl = document.getElementById('root');

var router = React.createElement(
    _reactRouter.Router,
    { history: _reactRouter.hashHistory },
    React.createElement(
        _reactRouter.Route,
        { path: '/', component: _app2.default },
        React.createElement(_reactRouter.IndexRoute, { component: _storybook_route_handler2.default }),
        React.createElement(_reactRouter.Route, { path: '/:kind', component: _storybook_route_handler2.default }),
        React.createElement(_reactRouter.Route, { path: '/:kind/:story', component: _storybook_route_handler2.default })
    )
);

ReactDOM.render(router, rootEl);