import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Link from './Link';

const Item = glamorous(({ title, route, className, ...props }) => (
  <li>
    <Link href={route}>
      {props.length ? (
        <a className={className}>{`> ${title}`}</a>
      ) : (
        <a className={className}>{title}</a>
      )}
    </Link>
  </li>
))(({ isActive }) => ({
  color: isActive ? 'hotpink' : 'orangered',
}));

const getItems = (sitemap, path) => {
  const out = Object.keys(sitemap).find(k => sitemap[k].files.find(f => f === path));
  if (!out) {
    return [];
  }

  return sitemap[out].files.map(k => sitemap[k]).sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return -1;
    }
    return 0;
  });
};

const SideNav = glamorous(({ sitemap, path, ...props }) => (
  <ul {...props} title={path.replace(/\/$/, '')}>
    {getItems(sitemap, path.replace(/\/$/, '')).map(item => (
      <Item {...item} isActive={item.route === path} key={item.route} />
    ))}
  </ul>
))({
  background: 'none',
  border: '0 none',
  padding: 0,
  '& > *': {
    height: '100%',
    width: 'auto',
  },
});

SideNav.displayName = 'SideNav';
SideNav.propTypes = {
  sitemap: PropTypes.oneOfType([PropTypes.object]),
};

export default SideNav;
