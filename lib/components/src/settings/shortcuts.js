import React from 'react';
import styled from 'react-emotion';

const ContentPanel = styled('div')(({ theme }) => ({
  boxSizing: 'border-box',
  flex: 1,
  margin: `${theme.layoutMargin}px ${theme.layoutMargin}px ${theme.layoutMargin}px 0`,
  padding: theme.layoutMargin,
  border: theme.mainBorder,
  background: theme.mainFill,
  justifyContent: 'flex-start',
  alignContent: 'flex-start',
  display: 'flex',
}));

export default () => <ContentPanel>about</ContentPanel>;
