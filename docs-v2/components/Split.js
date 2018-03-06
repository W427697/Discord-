import React, { Component } from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import { H2 } from './Markdown';

const Root = glamorous.div({
  position: 'relative',
  display: 'flex',
  marginLeft: -20,
  marginRight: -20,
  '@media(max-width: 840px)': {
    display: 'block',
  },
});

export class AsideNav extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.node.isRequired,
  };

  state = {
    expanded: false,
  };

  render() {
    const { expanded } = this.state;
    const { children, title } = this.props;

    return (
      <AsideNavWrapper expanded={expanded}>
        <H2 href="#!" onClick={() => this.setState({ expanded: !expanded })}>
          <AsideNavIndicator expanded={expanded}>+</AsideNavIndicator> {title}
        </H2>
        <AsideNavContent expanded={expanded}>{children}</AsideNavContent>
      </AsideNavWrapper>
    );
  }
}
const AsideNavWrapper = glamorous.nav(
  {
    transition: 'padding .3s linear, margin .3s linear',
    padding: 30,
    overflow: 'hidden',
    background: 'rgba(109, 171, 245, 0.1)',
    marginBottom: 30,
    marginTop: 30,
    userSelect: 'none',
    '&:first-child': {
      marginTop: 0,
    },
    '@media(max-width: 840px)': {
      width: 'auto',
      padding: 10,
    },
  },
  ({ expanded }) =>
    expanded
      ? {
          '@media(max-width: 840px)': {
            paddingTop: 20,
            paddingBottom: 20,
          },
        }
      : {
          '@media(max-width: 840px)': {
            background: 'rgba(109, 171, 245, 0.1)',
            marginBottom: 10,
            paddingBottom: 0,
            marginTop: 10,
          },
        }
);

const AsideNavContent = glamorous.div(
  ({ expanded }) =>
    expanded
      ? {}
      : {
          '@media(max-width: 840px)': {
            display: 'none',
          },
        }
);
const AsideNavIndicator = glamorous.span(
  {
    display: 'none',
    '@media(max-width: 840px)': {
      display: 'inline',
      float: 'right',
      transition: 'transform .4s ease .4s',
    },
  },
  ({ expanded }) => ({
    transform: `rotateZ(${expanded ? '45deg' : '0deg'})`,
  })
);

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
      margin: '0 10px 30px 10px',
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
