import React from 'react';
import { IconButton, Icons, Separator } from '@storybook/components';
import type { Addon_BaseType } from '@storybook/types';
import { Consumer, types } from '../../../api';
import type { Combo } from '../../../api';

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
            <IconButton aria-label="Show sidebar" key="menu" onClick={toggle} title="Show sidebar">
              <Icons icon="menu" />
            </IconButton>
            <Separator />
          </>
        )
      }
    </Consumer>
  ),
};
