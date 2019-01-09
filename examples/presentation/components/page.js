import React, { Children } from 'react';
import styled from '@emotion/styled';
import { stripIndent } from 'common-tags';

import SplitPane from 'react-split-pane';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { Spaced } from '@storybook/components';

import Link from './link';

const Page = styled.section(({ scroll = false }) => ({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: scroll ? 'auto' : 'hidden',
  textAlign: 'center',
}));

const Pane = styled.div({
  display: 'block',
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: '100%',
  height: '100%',
  '& > *': {
    display: 'block',
    position: 'absolute',
    overflow: 'auto',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});

const Split = styled(({ children, className }) => (
  <SplitPane split="vertical" className={className}>
    {Children.map(children, child => (
      <Pane>{child}</Pane>
    ))}
  </SplitPane>
))({
  '& > *': {
    position: 'relative',
  },
});

const Centered = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const CodePage = ({ children, scope }) => (
  <LiveProvider code={stripIndent(children)} scope={scope}>
    <Page>
      <Split>
        <Centered>
          <LiveError />
          <LivePreview />
        </Centered>
        <LiveEditor />
      </Split>
    </Page>
  </LiveProvider>
);

const ContactMe = styled.div({
  position: 'fixed',
  bottom: 0,
  right: 0,
  padding: 10,
});

const TitlePage = ({ children }) => (
  <Spaced row={1} outer={4}>
    {children}
    <ContactMe>
      <Link href="https://twitter.com/norbertdelangen">@norbertdelangen</Link>
    </ContactMe>
  </Spaced>
);

const IsolatedPage = ({ children }) => (
  <Spaced row={1} outer={4}>
    {children}
  </Spaced>
);

export { Page, CodePage, TitlePage, IsolatedPage };
