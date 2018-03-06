import React from 'react';

import Page, { generator } from '../../components/Page';

import TopNav from '../../components/TopNav';
import Blocks from '../../components/Blocks';
import Container from '../../components/Container';
import { Content } from '../../components/Content';

// eslint-disable-next-line no-unused-vars
import * as Markdown from '../../components/Markdown';
import content from '../../content/docs/api.md';

export default generator('DocsApi', ({ path, query }) => (
  <Page>
    <TopNav />
    <Content {...{ path, query }}>{content}</Content>
    <Container
      width={1000}
      vPadding={30}
      hPadding={30}
      background="linear-gradient(135deg, rgb(109, 171, 245) 0%, rgb(162, 224, 94) 100%)"
    >
      <Markdown.H1>For development</Markdown.H1>
      <Blocks colors={['rgba(0,0,0,0.08)']} max={4}>
        <p>bootstrapping the monorepo</p>
        <p>app architecture</p>
        <p>addon architecture</p>
        <p>releases</p>
        <p>open open source</p>
        <p>...</p>
      </Blocks>
    </Container>
  </Page>
));
