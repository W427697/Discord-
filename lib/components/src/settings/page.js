import React from 'react';
import styled from 'react-emotion';

import SplitPane from 'react-split-pane';
import { Link } from '../router/router';
import About from './about';
import Shortcuts from './shortcuts';

const StoriesPanelWrapper = styled('div')(({ theme }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  flex: 1,
  padding: theme.layoutMargin,
  background: theme.asideFill,
  justifyContent: 'space-between',
}));

const StoriesPanelInner = styled('div')({
  position: 'relative',
});

const Title = styled('h2')(({ theme }) => ({
  margin: 0,
  marginBottom: theme.layoutMargin,
  padding: 0,
}));

const NavList = styled('ul')(({ theme }) => ({
  margin: 0,
  marginBottom: theme.layoutMargin,
  padding: 0,
  display: 'block',
}));

const NavItem = styled('li')(({ theme, active }) => ({
  margin: 0,
  marginLeft: -theme.layoutMargin,
  marginRight: -theme.layoutMargin,
  borderBottom: theme.mainBorder,
  borderLeft: active ? `3px solid ${theme.highlightColor}` : '0 none',
  display: 'flex',
}));

const sections = {
  about: About,
  shortcuts: Shortcuts,
};

const A = styled(Link)(({ theme }) => ({
  display: 'block',
  flex: 1,
  padding: theme.layoutMargin,
  textDecoration: 'none',
  fontSize: theme.mainTextSize,
  color: 'inherit',
}));

const list = Object.keys(sections);

const Nav = ({ active }) => (
  <NavList>
    {list.map(i => (
      <NavItem key={i} active={active === i}>
        <A to={`/settings/${i}`}>{i}</A>
      </NavItem>
    ))}
  </NavList>
);

export default ({ params: { section } }) => (
  <SplitPane
    split="vertical"
    allowResize
    minSize={100}
    maxSize={-300}
    defaultSize={250}
    paneStyle={{ display: 'flex' }}
  >
    <StoriesPanelWrapper>
      <StoriesPanelInner>
        <Title>Settings</Title>
        <Nav active={section} />
      </StoriesPanelInner>
      <StoriesPanelInner>... bottom ...</StoriesPanelInner>
    </StoriesPanelWrapper>
    {sections[section]()}
  </SplitPane>
);
