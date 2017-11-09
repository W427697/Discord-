import React from 'react';
import glamorous from 'glamorous';

import Page, { generator } from '../../components/Page';
import TopNav from '../../components/TopNav';

const Placeholder = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  height: 'calc(100vh - 50px)',
  width: '100vw',
});

export default generator('RootExample', ({ path }) => (
  <Page>
    <TopNav {...{ path }} />

    <Placeholder>
      <div>
        <h1>TODO</h1>
        <div>I would like to add a real live demo here</div>
      </div>
    </Placeholder>
  </Page>
));
