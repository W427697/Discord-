import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Link from './Link';

const A = glamorous.a({
  display: 'inline-flex',
  alignItems: 'stretch',
  borderBottom: '1px solid rgba(200, 200, 200, 1)',
  textDecoration: 'none',
  position: 'relative',
  borderLeft: '1px solid rgba(200, 200, 200, 1)',
  paddingLeft: 8,
  cursor: 'pointer',
});

const Li = glamorous.li({
  display: 'block',
  lineHeight: '30px',
});

const Item = glamorous(({ title, route, className, ...props }) => (
  <Li>
    <Link href={route}>
      {props.length ? (
        <strong>
          <A className={className}>{title}</A>
        </strong>
      ) : (
        <A className={className}>{title}</A>
      )}
    </Link>
  </Li>
))(({ isActive, length }) => ({
  color: isActive ? 'rgb(241, 97, 97)' : 'currentColor',
  marginLeft: length ? -1 : 10,
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

const List = glamorous.ul({
  position: 'relative',
  padding: 0,
  margin: 0,
  color: 'black',
});

const SideNav = glamorous(({ sitemap, path, ...props }) => (
  <List {...props} title={path.replace(/\/$/, '')}>
    {getItems(sitemap, path.replace(/\/$/, '')).map(item => (
      <Item {...item} isActive={item.route === path} key={item.route} />
    ))}
  </List>
))({
  background: 'none',
  border: '0 none',
  color: 'black',
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
