import React from 'react';
import { IconButton, Icons } from '@junk-temporary-prototypes/components';
import { Consumer } from '@junk-temporary-prototypes/manager-api';
import type { Addon, Combo } from '@junk-temporary-prototypes/manager-api';

const menuMapper = ({ api, state }: Combo) => ({
  isVisible: state.layout.showPanel,
  singleStory: state.singleStory,
  panelPosition: state.layout.panelPosition,
  toggle: () => api.togglePanel(),
});

export const addonsTool: Addon = {
  title: 'addons',
  id: 'addons',
  match: ({ viewMode }) => viewMode === 'story',
  render: () => (
    <Consumer filter={menuMapper}>
      {({ isVisible, toggle, singleStory, panelPosition }) =>
        !singleStory &&
        !isVisible && (
          <>
            <IconButton aria-label="Show addons" key="addons" onClick={toggle} title="Show addons">
              <Icons icon={panelPosition === 'bottom' ? 'bottombar' : 'sidebaralt'} />
            </IconButton>
          </>
        )
      }
    </Consumer>
  ),
};
