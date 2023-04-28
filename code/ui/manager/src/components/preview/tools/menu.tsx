import React from 'react';
import { IconButton, Icons, Separator } from '@junk-temporary-prototypes/components';
import { Consumer } from '@junk-temporary-prototypes/manager-api';
import type { Addon, Combo } from '@junk-temporary-prototypes/manager-api';

const menuMapper = ({ api, state }: Combo) => ({
  isVisible: state.layout.showNav,
  singleStory: state.singleStory,
  toggle: () => api.toggleNav(),
});

export const menuTool: Addon = {
  title: 'menu',
  id: 'menu',
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
