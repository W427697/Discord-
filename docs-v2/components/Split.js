import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

const Root = glamorous.div({
  position: 'relative',
  display: 'flex',
  marginLeft: -20,
  marginRight: -20,
  '@media(max-width: 840px)': {
    display: 'block',
  },
});

export const Aside = glamorous.aside(
  {
    position: 'relative',
    width: 320,
    boxSizing: 'border-box',
    borderRadius: 3,
    margin: '0 20px',
    color: '#6dabf5',
    '@media(max-width: 840px)': {
      width: 'auto',
    },

    '& > *': {
      padding: 30,
      background: 'rgba(109, 171, 245, 0.1)',
      marginBottom: 30,
    },
  },
  ({ flip }) => ({
    order: flip ? -1 : 1,
  })
);
export const Main = glamorous.article({
  flex: 1,
  margin: '0 20px',
  '@media screen and (min-width: 840px)': {
    maxWidth: 'calc(100% - 400px)',
  },
});

const Split = ({ children, flip, ...rest }) => <Root {...rest}>{children}</Root>;

Split.displayName = 'Split';
Split.propTypes = {
  children: PropTypes.node.isRequired,
  flip: PropTypes.bool,
};
Split.defaultProps = {
  flip: false,
};

export default Split;
