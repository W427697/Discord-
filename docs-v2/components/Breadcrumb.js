import React, { Fragment } from 'react';
// import PropTypes from 'prop-types';
import glamorous from 'glamorous';

import Link from './Link';

import sitemap from '../lib/sitemap';

const PathItem = glamorous.a({
  display: 'inline-block',
  padding: 10,
  textDecoration: 'underline',
  outline: 0,
  color: 'currentColor',
  '&:hover': {
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
    <div className={className}>
      {items.map(({ name, path }, i, l) => (
        <Fragment key={path}>
          <Link href={path}>
            <PathItem href={path}>{name}</PathItem>
          </Link>
          {i + 1 < l.length ? '/' : null}
        </Fragment>
      ))}
    </div>
  );
})({
  backgroundColor: 'rgba(109, 171, 245, 0.1)',
  padding: '0 20px',
});

export default Breadcrumb;
