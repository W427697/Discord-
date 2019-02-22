import React from 'react';
import memoize from 'memoizerific';

import { Badge } from '@storybook/components';
import ListItemIcon from '../components/sidebar/ListItemIcon';

import { shortcutToHumanString } from '../libs/shortcut';

import Sidebar from '../components/sidebar/Sidebar';
import { Consumer } from '../core/context';

const createMenu = memoize(1)((api, shortcutKeys, isFullscreen, showPanel, showNav) => [
  {
    id: 'S',
    left: showNav ? <ListItemIcon icon="check" /> : <ListItemIcon />,
    onClick: () => api.toggleNav(),
    right: shortcutToHumanString(shortcutKeys.toggleNav),
    title: 'Show sidebar',
  },
  {
    id: 'A',
    left: showPanel ? <ListItemIcon icon="check" /> : <ListItemIcon />,
    onClick: () => api.togglePanel(),
    right: shortcutToHumanString(shortcutKeys.togglePanel),
    title: 'Show addons',
  },
  {
    id: 'D',
    left: <ListItemIcon />,
    onClick: () => api.togglePanelPosition(),
    right: shortcutToHumanString(shortcutKeys.panelPosition),
    title: 'Change addons orientation',
  },
  {
    id: 'F',
    left: isFullscreen ? 'check' : <ListItemIcon />,
    onClick: () => api.toggleFullscreen(),
    right: shortcutToHumanString(shortcutKeys.fullScreen),
    title: 'Go full screen',
  },
  {
    id: '/',
    left: <ListItemIcon />,
    onClick: () => {},
    right: shortcutToHumanString(shortcutKeys.search),
    title: 'Search',
  },
  {
    id: 'up',
    left: <ListItemIcon />,
    onClick: () => api.jumpToComponent(-1),
    right: shortcutToHumanString(shortcutKeys.prevComponent),
    title: 'Previous component',
  },
  {
    id: 'down',
    left: <ListItemIcon />,
    onClick: () => api.jumpToComponent(1),
    right: shortcutToHumanString(shortcutKeys.nextComponent),
    title: 'Next component',
  },
  {
    id: 'prev',
    left: <ListItemIcon />,
    onClick: () => api.jumpToStory(-1),
    right: shortcutToHumanString(shortcutKeys.prevStory),
    title: 'Previous story',
  },
  {
    id: 'next',
    left: <ListItemIcon />,
    onClick: () => api.jumpToStory(1),
    right: shortcutToHumanString(shortcutKeys.nextStory),
    title: 'Next story',
  },
  {
    id: 'about',
    left: <ListItemIcon />,
    onClick: () => api.navigate('/settings/about'),
    right: api.versionUpdateAvailable() && <Badge status="positive">Update</Badge>,
    title: 'About your Storybook',
  },
  {
    id: 'shortcuts',
    left: <ListItemIcon />,
    onClick: () => api.navigate('/settings/shortcuts'),
    right: shortcutToHumanString(shortcutKeys.shortcutsPage),
    title: 'Keyboard shortcuts',
  },
]);

export const mapper = (state, api) => {
  const {
    ui: { name, url },
    notifications,
    viewMode,
    storyId,
    layout: { isFullscreen, showPanel, showNav, panelPosition },
    storiesHash,
  } = state;

  const shortcutKeys = api.getShortcutKeys();
  return {
    title: name,
    url,
    notifications,
    stories: storiesHash,
    storyId,
    viewMode,
    menu: createMenu(api, shortcutKeys, isFullscreen, showPanel, showNav, panelPosition),
    menuHighlighted: api.versionUpdateAvailable(),
  };
};

export default props => (
  <Consumer>{({ state, api }) => <Sidebar {...props} {...mapper(state, api)} />}</Consumer>
);
