import React from 'react';
import { IconButton, Toolbar } from '@storybook/components/experimental';
import { Consumer, types } from '@storybook/manager-api';
import type { Combo } from '@storybook/manager-api';
import type { Addon_BaseType } from '@storybook/types';

const menuMapper = ({ api, state }: Combo) => ({
  isVisible: state.layout.showNav,
  singleStory: state.singleStory,
  toggle: () => api.toggleNav(),
});

export const menuTool: Addon_BaseType = {
  title: 'menu',
  id: 'menu',
  type: types.TOOL,
  match: ({ viewMode }) => ['story', 'docs'].includes(viewMode),
  render: () => (
    <Consumer filter={menuMapper}>
      {({ isVisible, toggle, singleStory }) =>
        !singleStory &&
        !isVisible && (
          <>
            <IconButton
              icon="Menu"
              aria-label="Show sidebar"
              key="menu"
              onClick={toggle}
              title="Show sidebar"
              size="small"
              variant="ghost"
            />
            <Toolbar.Separator />
          </>
        )
      }
    </Consumer>
  ),
};
