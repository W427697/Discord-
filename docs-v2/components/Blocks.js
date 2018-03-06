import React, { Children } from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Link from './Link';

const getColor = (list, index) => list[index] || getColor(list, index - list.length);

const itemPadding = {
  padding: '40px 30px 45px',
};

const Root = glamorous.div(
  {
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  ({ vSpacing = 0, hSpacing = 10, count = 1, max = 3 }) => ({
    marginLeft: -hSpacing / 2,
    marginRight: -hSpacing / 2,
    top: -hSpacing / 2,
    marginBottom: vSpacing - hSpacing,
    '& > *': {
      margin: hSpacing / 2,
      flex: '1 1 auto',
      flexBasis: `${100 / (count > max ? max : count) - 3}%`,
      '@media screen and (max-width: 500px)': {
        flexBasis: 'auto',
      },
    },
  })
);

const alignment = ({ aligned = true }) =>
  aligned
    ? {
        alignItems: 'center',
        justifyContent: 'center',
      }
    : {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      };
const variance = ({ color = 'silver', variant }) => {
  switch (variant) {
    case 'background': {
      return {
        background: color,
      };
    }
    case 'inverted': {
      return {
        backgroundColor: 'white',
        color,
      };
    }
    case 'bordered': {
      return {
        border: `3px solid ${color}`,
        backgroundColor: 'rgba(255,255,255,0.8)',

        // color,
      };
    }
    case 'masked': {
      return {
        color: 'rgba(0,0,0,1)',
        backgroundColor: 'transparent',
        '& > *': {
          position: 'relative',
          zIndex: 2,
          transition: 'all .5s',
        },
        '&::after': {
          transition: 'all .5s',

          content: '" "',
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          background: color,
          zIndex: 1,
          borderRadius: 3,
          opacity: 0.3,
        },
        '& a': {
          color: 'inherit',
        },
        '& a:hover': {
          color: 'inherit',
        },
      };
    }
    default: {
      return {};
    }
  }
};
const padding = ({ padded = false }) => (padded ? itemPadding : {});

const BlockItem = glamorous.div(
  {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '3px',
    display: 'flex',
    transition: 'all 2s',
    boxSizing: 'border-box',
    minWidth: 120,
  },
  alignment,
  variance,
  padding
);
export const BlockLink = glamorous(({ children, href, className }) => (
  <Link href={href}>
    <a className={className}>{children}</a>
  </Link>
))({
  padding: '30px 40px',

  boxSizing: 'border-box',
  height: 160,
  transition: 'all .3s',
  boxShadow: 'inset 0 0 0 0px rgba(0,0,0,0.08)',
  width: '100%',
  textDecoration: 'none',

  '& svg': {
    boxSizing: 'border-box',
    height: '100%',
    width: '100%',
  },
  '&:hover': {
    boxShadow: 'inset 0 0 0 3px rgba(0,0,0,0.08)',
  },
});

const Blocks = ({ children, colors, variant, padded, aligned, ...rest }) => (
  <Root {...rest} count={Children.count(children)}>
    {Children.toArray(children).map((child, index) => (
      <BlockItem key={child.key} {...{ variant, padded, aligned }} color={getColor(colors, index)}>
        {child}
      </BlockItem>
    ))}
  </Root>
);

Blocks.displayName = 'Blocks';
Blocks.propTypes = {
  aligned: PropTypes.bool,
  padded: PropTypes.bool,
  children: PropTypes.node.isRequired,
  vSpacing: PropTypes.number,
  hSpacing: PropTypes.number,
  max: PropTypes.number,
  variant: PropTypes.oneOf(['background', 'inverted', 'bordered', 'masked']),
  colors: PropTypes.arrayOf(PropTypes.string),
};
Blocks.defaultProps = {
  aligned: false,
  padded: false,
  vSpacing: undefined,
  hSpacing: undefined,
  max: undefined,
  variant: 'background',
  colors: ['#f1618c', '#f3ad38', '#a2e05e', '#b57ee5', '#6dabf5', '#f16161'],
};

export default Blocks;

export const BlockActions = glamorous.div(
  {
    position: 'relative',
    display: 'flex',
    flexWrap: 'wrap',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  ({ vSpacing = 0, hSpacing = 10 }) => ({
    marginLeft: -hSpacing / 2,
    marginRight: -hSpacing / 2,
    top: -hSpacing / 2,
    marginBottom: vSpacing - hSpacing,
    '& > *': {
      margin: hSpacing / 2,
    },
  })
);

export const BlockDescription = glamorous.p({
  position: 'absolute',
  zIndex: 1,
  bottom: -16,
  left: 0,
  right: 0,
  textAlign: 'center',
  padding: 16,
  fontWeight: 300,
  color: 'white',
  background: 'rgba(134, 134, 134, 0.46)',
  mixBlendMode: 'luminosity',
  textShadow: '0 0 2px rgba(0,0,0,0.5)',
  fontSize: 14,
});

export const BlockLabel = glamorous.p({
  position: 'absolute',
  top: -9,
  right: -31,
  width: '154px',
  background: 'rgba(212, 212, 212, 0.62)',
  height: 24,
  transform: 'rotateZ(30deg)',
  textAlign: 'center',
  lineHeight: '24px',
  paddingLeft: 50,
  mixBlendMode: 'darken',
  color: 'black',
  fontSize: 12,
});
