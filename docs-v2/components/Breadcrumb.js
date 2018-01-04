import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import glamorous from 'glamorous';

import Link from './Link';

import sitemap from '../lib/sitemap';

const PathItem = glamorous.a({
  display: 'inline-block',
  padding: 17,
  fontSize: 13,
  textDecoration: 'none',
  outline: 0,
  color: 'currentColor',

  '&:hover, &:active, &:focus': {
    textDecoration: 'underline',
    outline: 0,
    color: '#f1618c',
  },
});

const Breadcrumb = glamorous(({ input, className }) => {
  const items = input.split('/').reduce(
    (acc, item, index, list) =>
      acc.concat(
        item === ''
          ? { name: 'Home', path: '/' }
          : {
              name: (sitemap[`${list.slice(0, index).join('/')}/${item}`] || { title: item }).title,
              path: `${list.slice(0, index).join('/')}/${item}`,
            }
      ),
    []
  );

  return items.length < 2 ? null : (
    <nav className={className}>
      {items.map(({ name, path }, i, l) => (
        <Fragment key={path}>
          <Link href={path}>
            <PathItem href={path}>{name}</PathItem>
          </Link>
          {i + 1 < l.length ? <span>/</span> : null}
        </Fragment>
      ))}
    </nav>
  );
})({
  position: 'relative',
  zIndex: 1000,
  boxSizing: 'border-box',
  boxShadow: '0 0 30px rgba(0,0,0,0.3)',
  height: 50,
  backgroundImage:
    'linear-gradient(to bottom, rgba(255,255,255, 1) 0%, rgba(244,244,244, 0.94) 100%)',
});

export default Breadcrumb;
