import React from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { window } from 'global';

const versionRegex = [/^\/([0-9]+-[0-9]+-[0-9]+)\//, /^\/([0-9]+-[0-9]+-[0-9]+)$/];

function getVersionHref(path, href) {
  if (!path) {
    return href;
  }

  const versionMatch = versionRegex.map(regex => path.match(regex)).find(match => match);

  if (!versionMatch || !versionMatch[1]) {
    return href;
  }

  const version = versionMatch[1];
  return `/${version}${href}`;
}

function Link(props) {
  const { href, ...rest } = props;
  const path = window ? window.location.pathname : '';
  const versionAwareHref = getVersionHref(path, href);

  return <NextLink {...rest} as={versionAwareHref} href={href} />;
}

Link.propTypes = {
  href: PropTypes.string.isRequired,
};

export default Link;
