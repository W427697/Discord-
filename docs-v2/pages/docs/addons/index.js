import React from 'react';

import Head from 'next/head';
import Page, { generator } from '../../../components/Page';

import TopNav from '../../../components/TopNav';
import PageTitle from '../../../components/PageTitle';
import Blocks from '../../../components/Blocks';
import Container from '../../../components/Container';

import sitemap from '../../../lib/sitemap';

export default generator('DocsIndex', ({ path }) => (
  <Page>
    <Head>
      <title>Storybook Documentation</title>
    </Head>
    <TopNav {...{ path }} />
    <PageTitle minHeight="auto">
      <h1>Documentation</h1>
      <p>This section contains full documentation concerning API, CLI and configuration</p>
    </PageTitle>
    <Container width="100%" vSpacing={30} hPadding={10}>
      <h1>Storybook Addons</h1>
      <Blocks aligned={false} variant="masked" padded>
        {sitemap['/docs/addons'].files.map(i => sitemap[i]).map(data => (
          <section>
            <h2>{data.title}</h2>
          </section>
        ))}
      </Blocks>
    </Container>
  </Page>
));
