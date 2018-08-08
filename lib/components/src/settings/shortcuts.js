import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

import Alert from '../alert/alert';
import Heading from '../heading/heading';
import { Spaced } from '../grid/grid';

const ContentPanel = styled('div')(({ theme }) => ({
  boxSizing: 'border-box',
  flex: 1,
  margin: `${theme.layoutMargin}px ${theme.layoutMargin}px ${theme.layoutMargin}px 0`,
  padding: theme.layoutMargin * 2,
  border: theme.mainBorder,
  background: theme.mainFill,
  display: 'block',
}));

const ShortcutsPage = ({ shortcuts }) => (
  <ContentPanel>
    <Spaced row={2}>
      <Heading>Keyboard shortcuts</Heading>
      {shortcuts}
      <Alert type="success">
        These will be configurable/editable in the future,{' '}
        <a
          href="https://github.com/storybooks/storybook/issues/3984"
          rel="noopener noreferrer"
          target="_blank"
        >
          want to help?
        </a>
      </Alert>
    </Spaced>
  </ContentPanel>
);
ShortcutsPage.propTypes = {
  shortcuts: PropTypes.node.isRequired,
};

export { ShortcutsPage as default };
