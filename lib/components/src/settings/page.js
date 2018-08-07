import React from 'react';
import SplitPane from 'react-split-pane';

import styled from 'react-emotion';

const StoriesPanelWrapper = styled('div')(({ theme }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  flex: 1,
  padding: theme.layoutMargin,
  background: theme.asideFill,
  justifyContent: 'space-between',
}));

const StoriesPanelInner = styled('div')({
  position: 'relative',
});

const ContentPanel = styled('div')(({ theme }) => ({
  boxSizing: 'border-box',
  flex: 1,
  margin: `${theme.layoutMargin}px ${theme.layoutMargin}px ${theme.layoutMargin}px 0`,
  padding: theme.layoutMargin,
  border: theme.mainBorder,
  background: theme.mainFill,
}));

export default () => (
  <SplitPane
    split="vertical"
    allowResize
    minSize={100}
    maxSize={-300}
    defaultSize={250}
    paneStyle={{ display: 'flex' }}
  >
    <StoriesPanelWrapper>
      <StoriesPanelInner>... left ...</StoriesPanelInner>
      <StoriesPanelInner>... bottom ...</StoriesPanelInner>
    </StoriesPanelWrapper>
    <ContentPanel>Hello Settings</ContentPanel>;
  </SplitPane>
);
