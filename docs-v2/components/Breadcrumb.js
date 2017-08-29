import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

const List = glamorous.ol({});
const Item = glamorous.li({});

const Breadcrumb = ({ path }) =>
  path.length > 1
    ? <List>
        {path.map(Item)}
      </List>
    : null;

Breadcrumb.displayName = 'Breadcrumb';
Breadcrumb.propTypes = {
  path: PropTypes.arrayOf(PropTypes.string),
};
Breadcrumb.defaultProps = {
  path: [],
};
