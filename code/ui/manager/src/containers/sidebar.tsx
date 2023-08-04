import React from 'react';

import type { Combo, StoriesHash } from '@storybook/manager-api';
import { Consumer } from '@storybook/manager-api';

import { Sidebar as SidebarComponent } from '../components/sidebar/Sidebar';
import { useMenu } from './menu';
import { getAncestorIds } from '../utils/tree';

export type Item = StoriesHash[keyof StoriesHash];

const Sidebar = React.memo(function Sideber() {
  const mapper = ({ state, api }: Combo) => {
    const {
      ui: { name, url, enableShortcuts },
      viewMode,
      storyId,
      refId,
      layout: { showToolbar, isFullscreen, showPanel, showNav },
      index,
      status,
      indexError,
      previewInitialized,
      refs,
      filters,
    } = state;

    const menu = useMenu(
      state,
      api,
      showToolbar,
      isFullscreen,
      showPanel,
      showNav,
      enableShortcuts
    );

    const whatsNewNotificationsEnabled =
      state.whatsNewData?.status === 'SUCCESS' && !state.disableWhatsNewNotifications;

    const filtered = new Set();

    Object.values(index || {}).forEach((item) => {
      if (item.type === 'story' || item.type === 'docs') {
        let result = true;

        Object.values(filters).forEach((filter) => {
          if (result === true) {
            result = filter({ ...item, status: status[item.id] });
          }
        });

        if (result) {
          filtered.add(item.id);
          getAncestorIds(index, item.id).forEach((id) => {
            filtered.add(id);
          });
        }
      }
    });

    const newIndex = Object.fromEntries(
      Object.entries(index || {}).filter(([key]) => filtered.has(key))
    );

    return {
      title: name,
      url,
      index: newIndex,
      indexError,
      status,
      previewInitialized,
      refs,
      storyId,
      refId,
      viewMode,
      menu,
      menuHighlighted: whatsNewNotificationsEnabled && api.isWhatsNewUnread(),
      enableShortcuts,
    };
  };
  return (
    <Consumer filter={mapper}>
      {(fromState) => {
        return <SidebarComponent {...fromState} />;
      }}
    </Consumer>
  );
});

export default Sidebar;
