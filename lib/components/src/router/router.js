import React from 'react';
import { matchPath } from 'react-router';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import qs from 'qs';

const QueryLink = props => (
  <Link {...props} to={{ path: '/', search: qs.stringify({ path: props.to, ...props.query }) }} />
);

const QueryRoute = ({ path, render, exact = false, strict = false, ...props }) => (
  <Route
    render={({ location: { search } }) => {
      // keep backwards compatibility by asserting /components as default
      const target = qs.parse(search, { ignoreQueryPrefix: true }).path || '/components';
      const options = {
        path,
        strict,
        exact,
      };
      const match = matchPath(target, options);

      if (match) {
        return render({ ...props, ...match });
      }
      return null;
    }}
  />
);

export { Router, QueryRoute as Route, QueryLink as Link };
