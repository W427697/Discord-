import type { ComponentProps } from 'react';
import React, { Fragment } from 'react';
import { addons, types } from '@storybook/manager-api';

import { Icons, IconButton, Bar, TabButton } from '@storybook/components';
import { styled } from '@storybook/theming';
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

export const Toolbar = styled(
  ({ shown = true, ...props }: ComponentProps<typeof Bar> & { shown: boolean }) => (
    <Bar {...props} />
  )
)(
  {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    transition: 'transform .2s linear',
  },
  ({ shown }) => ({
    transform: shown ? 'translateY(0px)' : 'translateY(-40px)',
  })
);
export const FrameWrap = styled.div<{ offset: number }>(({ offset }) => ({
  position: 'absolute',
  overflow: 'auto',
  left: 0,
  right: 0,
  bottom: 0,
  top: offset,
  zIndex: 3,
  transition: 'all 0.1s linear',
  height: `calc(100% - ${offset}px)`,
  background: 'transparent',
}));
export const Centered = styled.div({
  position: 'relative',

  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

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
      return (
        <>
          <Toolbar shown border>
            <TabButton active>A tab</TabButton>
            <IconButton
              key="first"
              title="Go to first story, for some reason. It's just a demo."
              onClick={() => api.selectFirstStory()}
            >
              <Icons icon="star" />
            </IconButton>
          </Toolbar>
          <FrameWrap offset={40}>
            <Centered>
              This is the contents of my addon, in a full viewport experience, what a joy!
            </Centered>
          </FrameWrap>
        </>
      );
    },
  });
});
