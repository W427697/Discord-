import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

import { H2 } from './Markdown';

const SectionNr = glamorous.span({
  userSelect: 'none',
  paddingRight: 6,
  paddingLeft: 6,
  marginLeft: 0,
  borderLeft: '1px solid rgba(200, 200, 200, 1)',
  color: 'rgb(241, 97, 97)',
});
const SectionLabel = glamorous.span({
  lineHeight: '17px',
  paddingTop: 7,
  paddingBottom: 7,
});

const Ol = glamorous.ol({
  display: 'block',
  padding: 0,
  margin: 0,
  marginLeft: 10,
  paddingBottom: 10,
  overflow: 'hidden',
});
const Li = glamorous.li(
  {
    display: 'block',
    lineHeight: '30px',
  },
  ({ hasMany }) => ({
    borderLeft: hasMany ? '1px solid rgba(200, 200, 200, 1)' : '1px solid transparent',
  })
);
const A = glamorous(({ children, path, hasMany, ...rest }) =>
  <a {...rest}>
    {children}
  </a>
)({
  color: 'currentColor',
  display: 'inline-flex',
  alignItems: 'stretch',
  borderBottom: '1px solid rgba(200, 200, 200, 1)',
  textDecoration: 'none',
  position: 'relative',
  marginLeft: -1,
});

const List = glamorous.ol({
  position: 'relative',
  padding: 0,
  margin: 0,
  color: 'black',
});

const Item = ({ id, title, children, key }, index, list) =>
  <Li key={key} hasMany={index < list.length - 1}>
    <A href={`#${id}`}>
      <SectionNr>
        {key}
      </SectionNr>
      <SectionLabel>
        {title}
      </SectionLabel>
    </A>
    {children.length
      ? <Ol>
          {children.map(Item)}
        </Ol>
      : null}
  </Li>;
Item.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  key: PropTypes.string.isRequired,
};

const getKey = (list, level) => {
  const n =
    level === 1
      ? list.length
      : `${list.length}.${getKey(list[list.length - 1].children, level - 1)}`;
  return n;
};

const getLevel = (list, level) =>
  level === 1 ? list.children || list : getLevel(list[list.length - 1].children, level - 1);
const mapListToTree = list => {
  const output = [];
  list.forEach(item => {
    const level = item['aria-level'];
    const { id, title } = item;
    const localList = getLevel(output, level);
    const entry = { id, title, key: undefined, children: [] };
    localList.push(entry);
    entry.key = getKey(output, level);
  });
  return output;
};

const Toc = ({ toc }) =>
  toc.length
    ? <div>
        <H2>Table of contents</H2>
        <List>
          {mapListToTree(toc).map(Item)}
        </List>
      </div>
    : null;

Toc.displayName = 'Toc';
Toc.propTypes = {
  toc: PropTypes.arrayOf(PropTypes.object),
};
Toc.defaultProps = {
  toc: [],
};

export default Toc;
