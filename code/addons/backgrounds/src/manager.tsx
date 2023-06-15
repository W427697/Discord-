import React, { Fragment } from 'react';
import { addons, types } from '@storybook/manager-api';

import { Icons, IconButton } from '@storybook/components';
import { ADDON_ID } from './constants';
import { BackgroundSelector } from './containers/BackgroundSelector';
import { GridSelector } from './containers/GridSelector';

addons.register(ADDON_ID, () => {
  addons.add(ADDON_ID, {
    title: 'Backgrounds',
    id: 'backgrounds',
    type: types.TOOL,
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: () => (
      <Fragment>
        <BackgroundSelector />
        <GridSelector />
      </Fragment>
    ),
  });
});

// TODO: remove after API is completed
addons.register('@storybook/addon-debugger', (api) => {
  addons.add(ADDON_ID, {
    title: 'Backgrounds',
    id: 'backgrounds',
    type: types.TOOLEXTRA,
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: () => (
      <Fragment>
        <IconButton
          key="debugger"
          title="navigate to debugger-view"
          onClick={() =>
            api.navigateUrl(`/debugger/${api.getCurrentStoryData().id}`, { plain: false })
          }
        >
          <Icons icon="lightning" />
        </IconButton>
      </Fragment>
    ),
  });
  addons.add('@storybook/addon-debugger/panel', {
    // TODO: I hacked it so title is the route this activates on
    title: '/debugger/',
    type: types.experimental_MAIN,
    render: () => {
      console.log('render debugger');
      return <div>page content</div>;
    },
  });
});
