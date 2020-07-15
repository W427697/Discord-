import React, { FunctionComponent, SyntheticEvent, Fragment } from 'react';
import { IconButton, Icons, FlexBar, TabBar, TabButton, ScrollArea } from '@storybook/components';
import { useStorybookApi, API, useStorybookState } from '@storybook/api';
import { Location, Route } from '@storybook/router';
import { styled } from '@storybook/theming';
import { GlobalHotKeys } from 'react-hotkeys';
import { AboutPage } from './about_page';
import { ReleaseNotesPage } from './release_notes_page';
import { ShortcutsPage } from './shortcuts_page';

const TabBarButton: FunctionComponent<{ id: string; title: string }> = ({ id, title }) => (
  <Location>
    {({ navigate, path }) => {
      const active = path.includes(`settings/${id}`);
      return (
        <TabButton
          id={`tabbutton-${id}`}
          className={['tabbutton'].concat(active ? ['tabbutton-active'] : []).join(' ')}
          type="button"
          key="id"
          active={active}
          onClick={(e: any) => {
            e.preventDefault();
            navigate(`/settings/${id}`);
          }}
          role="tab"
        >
          {title}
        </TabButton>
      );
    }}
  </Location>
);

const Content = styled(ScrollArea)({
  position: 'absolute',
  top: 40,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'auto',
});

const keyMap = {
  CLOSE: 'escape',
};

const Pages: FunctionComponent<{ onClose: API['closeSettings'] }> = ({ onClose }) => (
  <Fragment>
    <FlexBar border>
      <TabBar role="tablist">
        <TabBarButton id="about" title="About" />
        <TabBarButton id="shortcuts" title="Keyboard shortcuts" />
        <TabBarButton id="release-notes" title="Release notes" />
      </TabBar>
      <IconButton
        onClick={(e: SyntheticEvent) => {
          e.preventDefault();
          return onClose();
        }}
      >
        <Icons icon="close" />
      </IconButton>
    </FlexBar>
    <Content vertical horizontal={false}>
      <Route path="about">
        <AboutPage key="about" />
      </Route>
      <Route path="release-notes">
        <ReleaseNotesPage key="release-notes" />
      </Route>
      <Route path="shortcuts">
        <ShortcutsPage key="shortcuts" />
      </Route>
    </Content>
    <Route path="settings">
      <GlobalHotKeys handlers={{ CLOSE: onClose }} keyMap={keyMap} />
    </Route>
  </Fragment>
);

const SettingsPages: FunctionComponent = () => {
  const api = useStorybookApi();
  const { lastSuccessfulStoryPath } = useStorybookState();

  return (
    <Pages
      onClose={() =>
        lastSuccessfulStoryPath ? api.navigate(lastSuccessfulStoryPath) : api.selectFirstStory()
      }
    />
  );
};

export { SettingsPages as default };
