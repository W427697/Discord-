import { Router, IndexRoute, Route, hashHistory } from 'react-router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './ui/app';
import StorybookRouteHandler from './ui/storybook_route_handler';

const rootEl = document.getElementById('root');

const router = (
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={StorybookRouteHandler} />
            <Route path="/:kind" component={StorybookRouteHandler} />
            <Route path="/:kind/:story" component={StorybookRouteHandler} />
        </Route>
    </Router>
);

ReactDOM.render(router, rootEl);
