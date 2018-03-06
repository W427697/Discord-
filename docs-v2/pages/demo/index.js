import React from 'react';
import glamorous from 'glamorous';

import Page, { generator } from '../../components/Page';
import TopNav from '../../components/TopNav';

const Placeholder = glamorous.iframe({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  height: 'calc(100vh - 90px)',
  width: 'calc(100vw - 40px)',
  margin: 20,
  border: '1px solid silver',
});

export default generator('RootExample', ({ path }) => (
  <Page>
    <TopNav {...{ path }} />

    <Placeholder src="https://sbnext.netlify.com/" />
  </Page>
));
