import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

const Root = glamorous.section(
  {
    position: 'relative',
    boxSizing: 'border-box',
  },
  ({ vSpacing = 0, vPadding = 0, hSpacing = 0, hPadding = 10, background = 'transparent' }) => ({
    marginLeft: hSpacing,
    marginRight: hSpacing,
    marginTop: vSpacing,
    marginBottom: vSpacing,
    paddingTop: vPadding,
    paddingBottom: vPadding,
    background,
    paddingLeft: hPadding,
    paddingRight: hPadding,
  })
);
const Width = glamorous.div(
  {
    marginLeft: 'auto',
    marginRight: 'auto',
    boxSizing: 'border-box',
  },
  ({ width }) => ({
    maxWidth: width,
  })
);

const Container = ({ children, width, ...rest }) => (
  <Root {...rest}>{width ? <Width {...{ width }}>{children}</Width> : children}</Root>
);

Container.displayName = 'Container';
Container.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.number,
  vSpacing: PropTypes.number,
  vPadding: PropTypes.number,
  hSpacing: PropTypes.number,
  hPadding: PropTypes.number,
  background: PropTypes.string,
};
Container.defaultProps = {
  width: undefined,
  vSpacing: undefined,
  vPadding: undefined,
  hSpacing: undefined,
  hPadding: undefined,
  background: undefined,
};

export default Container;
