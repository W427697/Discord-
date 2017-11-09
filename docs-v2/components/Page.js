import React from 'react';
import PropTypes from 'prop-types';
import { window } from 'global';
import { rehydrate, css } from 'glamor';

// Adds server generated styles to glamor cache.
// Has to run before any `style()` calls
// '__NEXT_DATA__.ids' is set in '_document.js'
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-underscore-dangle
  rehydrate(window.__NEXT_DATA__.ids);
}

const splitPath = uri => {
  const [path, hash] = uri.split('#');

  return {
    path,
    hash,
  };
};

const Page = ({ children }) => {
  css.global('html', {
    margin: 0,
    padding: 0,
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
    fontSize: '16px',
    height: '100%',
    minHeight: '100%',
    backgroundAttachment: 'fixed',
    backgroundImage:
      'radial-gradient(ellipse at top left, rgba(255,255,255,1) 11%,rgba(232,232,232,1) 100%)',
  });
  css.global('body', {
    margin: 0,
    padding: '50px 0 0 0',
  });

  return <main>{children}</main>;
};
Page.propTypes = {
  children: PropTypes.node.isRequired,
};

export { Page as default };

export const generator = (name, content) => {
  const Component = ({ query, path = window.location.pathname, hash = window.location.hash }) =>
    content({ query, path: path.replace(/\/$/, '').replace(/^https?\/\/[^/]*/, ''), hash });
  Component.displayName = name;
  Component.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    query: PropTypes.object,
    path: PropTypes.string.isRequired,
    hash: PropTypes.string,
  };
  Component.defaultProps = {
    query: {},
    hash: '',
  };

  Component.getInitialProps = ({ asPath, query }) => ({
    ...splitPath(asPath),
    query,
  });

  return Component;
};
