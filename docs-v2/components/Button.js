import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Link from './Link';

const variants = {
  gray: {
    color: '#8a8a8a',
  },
};
const sizes = {
  0: {
    padding: '2px 6px',
    fontSize: 10,
  },
  1: {
    padding: '4px 10px',
    fontSize: 12,
  },
  2: {
    padding: '6px 12px',
    fontSize: 14,
  },
  3: {
    padding: '8px 18px',
    fontSize: 16,
  },
  4: {
    padding: '10px 20px',
    fontSize: 18,
  },
};

const A = ({ href, children, className }) => (
  <Link href={href}>
    <a className={className}>{children}</a>
  </Link>
);
A.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
};

const Button = glamorous(A)(
  {
    display: 'inline-block',
    background: 'transparent',
    border: '1px solid currentColor',
    padding: '6px 12px',
    borderRadius: 4,
    color: 'inherit',
    textDecoration: 'none',
    opacity: 0.8,
    transition: 'all 0.3s',
    boxShadow: ' 0 0 0 3px rgba(0,0,0,0.00)',

    '&:hover': {
      opacity: 1,
      boxShadow: '0 0 0 3px rgba(0,0,0,0.08)',
      zIndex: 1,
      position: 'relative',
    },
  },
  ({ variant = '' }) =>
    variant.split(',').reduce((acc, v) => ({ ...acc, ...variants[v.trim()] }), {}),
  ({ size = 2 }) => sizes[size]
);

Button.displayName = 'Button';
Button.propTypes = {
  children: PropTypes.node,
};
Button.defaultProps = {
  children: '',
};

export default Button;
