import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { ThemeProvider } from 'emotion-theming';

import { themes } from '../';
import { NavSecondary, NavBar, NavBarHead, NavPrimary, Other } from './navbar';
import { Router, Route, Link } from '../router/router';
import MobileLayout from './mobile';
import DesktopLayout from './desktop';
import Settings from '../settings/page';

export const Root = styled('div')(
  ({ theme }) => ({
    background: theme.mainBackground,
    fontFamily: theme.mainTextFace,
    color: theme.mainTextColor,
    fontSize: theme.mainTextSize,
  }),
  ({ isMobileDevice }) =>
    isMobileDevice
      ? {
          display: 'flex',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '100vw',
          overflow: 'auto',
        }
      : {
          position: 'fixed',
          display: 'flex',
          top: 0,
          left: 0,
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
        }
);

const StoriesPanelInner = styled('div')({
  flexGrow: 1,
  position: 'relative',
  height: '100%',
  width: '100%',
  overflow: 'auto',
});

const primaryList = [
  // {
  //   link: (
  //     <Link key="token" to="/tokens">
  //       <NavPrimary>T</NavPrimary>
  //     </Link>
  //   ),
  //   render: <Route key="token" path="/tokens" render={() => <Other>Hello tokens!</Other>} />,
  // },
  // {
  //   link: (
  //     <Link key="docs" to="/docs">
  //       <NavPrimary>D</NavPrimary>
  //     </Link>
  //   ),
  //   render: <Route key="docs" path="/docs" render={() => <Other>Hello docs!</Other>} />,
  // },
];

const secondaryList = [
  {
    link: (
      <Link key="settings" to="/settings">
        <NavSecondary>
          <svg
            className="MuiSvgIcon-root-66 MuiListItemIcon-root-99"
            focusable="false"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
          </svg>
        </NavSecondary>
      </Link>
    ),
    render: (
      <Route
        key="settings"
        path="/settings"
        render={() => (
          <Other>
            <Settings />
          </Other>
        )}
      />
    ),
  },
];

const Layout = props => {
  const {
    isMobileDevice,
    addonPanel: AddonPanel,
    storiesPanel: StoriesPanel,
    preview: Preview,
    shortcutsHelp: ShortcutsHelp,
    searchBox: SearchBox,
    uiOptions: { name, theme },
  } = props;

  return (
    <Router>
      <ThemeProvider theme={theme || themes.normal}>
        <Root isMobileDevice={isMobileDevice}>
          <NavBar>
            <div>
              <NavBarHead>{name}</NavBarHead>
              <Link to="/components">
                <NavPrimary>
                  <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2zm-4 10H4V5h14v14zM6 13h5v4H6zm6-6h4v3h-4zM6 7h5v5H6zm6 4h4v6h-4z" />
                  </svg>
                </NavPrimary>
              </Link>
              {primaryList.map(item => item.link)}
            </div>
            <div>{secondaryList.map(item => item.link)}</div>
          </NavBar>
          <Route
            exact
            path="/components"
            render={() => (
              <Other>
                {isMobileDevice ? (
                  <MobileLayout>
                    <StoriesPanelInner>
                      <StoriesPanel />
                    </StoriesPanelInner>
                    <StoriesPanelInner>
                      <Preview />
                    </StoriesPanelInner>
                    <AddonPanel />
                  </MobileLayout>
                ) : (
                  <DesktopLayout {...props} />
                )}
                <SearchBox />
              </Other>
            )}
          />
          {primaryList.map(item => item.render)}
          {secondaryList.map(item => item.render)}
          <ShortcutsHelp />
        </Root>
      </ThemeProvider>
    </Router>
  );
};

Layout.propTypes = {
  uiOptions: PropTypes.shape({
    theme: PropTypes.shape({}),
  }).isRequired,
  // showStoriesPanel: PropTypes.bool.isRequired,
  // showAddonPanel: PropTypes.bool.isRequired,
  // goFullScreen: PropTypes.bool.isRequired,
  storiesPanel: PropTypes.func.isRequired,
  preview: PropTypes.func.isRequired,
  addonPanel: PropTypes.func.isRequired,
  shortcutsHelp: PropTypes.func.isRequired,
  searchBox: PropTypes.func.isRequired,
  // addonPanelInRight: PropTypes.bool.isRequired,
  isMobileDevice: PropTypes.bool.isRequired,
};

export default Layout;
