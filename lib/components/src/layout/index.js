import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { ThemeProvider } from 'emotion-theming';

import { themes, NavSecondary, NavBar, NavBarHead, NavPrimary } from '../';

import MobileLayout from './mobile';
import DesktopLayout from './desktop';
import { Other } from './navbar';

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
    <ThemeProvider theme={theme || themes.normal}>
      <Root isMobileDevice={isMobileDevice}>
        <NavBar>
          <div>
            <NavBarHead>{name}</NavBarHead>
            <NavPrimary>T</NavPrimary>
            <NavPrimary>C</NavPrimary>
            <NavPrimary>D</NavPrimary>
          </div>
          <div>
            <NavSecondary>S</NavSecondary>
          </div>
        </NavBar>
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
        </Other>
        <ShortcutsHelp />
        <SearchBox />
      </Root>
    </ThemeProvider>
  );
};

Layout.propTypes = {
  uiOptions: PropTypes.shape({
    theme: PropTypes.shape({}),
  }).isRequired,
  showStoriesPanel: PropTypes.bool.isRequired,
  showAddonPanel: PropTypes.bool.isRequired,
  goFullScreen: PropTypes.bool.isRequired,
  storiesPanel: PropTypes.func.isRequired,
  preview: PropTypes.func.isRequired,
  addonPanel: PropTypes.func.isRequired,
  shortcutsHelp: PropTypes.func.isRequired,
  searchBox: PropTypes.func.isRequired,
  addonPanelInRight: PropTypes.bool.isRequired,
  isMobileDevice: PropTypes.bool.isRequired,
};

export default Layout;
