import React from 'react';
import memoize from 'memoizerific';

import { Badge } from '@storybook/components';

import { shortcutToHumanString } from '../libs/shortcut';

import Sidebar from '../components/sidebar/Sidebar';
import { Consumer } from '../core/context';

const createMenu = memoize(1)(
  (api, shortcutKeys, isFullscreen, showPanel, showNav, panelPosition) => {
    return [
      {
        action: () => api.navigate('/settings/about'),
        detail: api.versionUpdateAvailable() && <Badge>Update</Badge>,
        icon: '',
        id: 'about',
        title: 'About your storybook',
      },
      {
        action: () => api.navigate('/settings/shortcuts'),
        detail: shortcutToHumanString(shortcutKeys.shortcutsPage),
        icon: '',
        id: 'shortcuts',
        title: 'Keyboard Shortcuts',
      },
      {
        action: () => api.toggleFullscreen(),
        detail: shortcutToHumanString(shortcutKeys.fullScreen),
        icon: isFullscreen ? 'check' : '',
        id: 'F',
        title: 'Go Fullscreen',
      },
      {
        action: () => api.togglePanel(),
        detail: shortcutToHumanString(shortcutKeys.togglePanel),
        icon: showPanel ? 'check' : '',
        id: 'S',
        title: 'Toggle Panel',
      },
      {
        action: () => api.togglePanelPosition(),
        detail: shortcutToHumanString(shortcutKeys.panelPosition),
        icon: panelPosition === 'bottom' ? 'bottombar' : 'sidebaralt',
        id: 'D',
        title: 'Toggle Panel Position',
      },
      {
        action: () => api.toggleNav(),
        detail: shortcutToHumanString(shortcutKeys.toggleNav),
        icon: showNav ? 'check' : '',
        id: 'A',
        title: 'Toggle Navigation',
      },
      {
        action: Function.prototype,
        detail: shortcutToHumanString(shortcutKeys.search),
        icon: 'search',
        id: '/',
        title: 'Search',
      },
      {
        action: () => api.jumpToComponent(-1),
        detail: shortcutToHumanString(shortcutKeys.prevComponent),
        icon: '',
        id: 'up',
        title: 'Previous component',
      },
      {
        action: () => api.jumpToComponent(1),
        detail: shortcutToHumanString(shortcutKeys.nextComponent),
        icon: '',
        id: 'down',
        title: 'Next component',
      },
      {
        action: () => api.jumpToStory(-1),
        detail: shortcutToHumanString(shortcutKeys.prevStory),
        icon: '',
        id: 'prev',
        title: 'Previous story',
      },
      {
        action: () => api.jumpToStory(1),
        detail: shortcutToHumanString(shortcutKeys.nextStory),
        icon: '',
        id: 'next',
        title: 'Next story',
      },
    ];
  }
);

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
    menu: createMenu(api, shortcutKeys, isFullscreen, showPanel, showNav, panelPosition),
    menuHighlighted: api.versionUpdateAvailable(),
    notifications,
    stories: storiesHash,
    storyId,
    title: name,
    url,
    viewMode,
  };
};

export default props => (
  <Consumer>{({ state, api }) => <Sidebar {...props} {...mapper(state, api)} />}</Consumer>
);
