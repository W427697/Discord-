import React from 'react';

import Head from 'next/head';
import { Logos } from '@storybook/components';

import Page, { generator } from '../../../components/Page';

import TopNav from '../../../components/TopNav';
import PageTitle from '../../../components/PageTitle';
import Container from '../../../components/Container';

import { H1 } from '../../../components/Markdown';
import Blocks, { BlockLink, BlockLabel } from '../../../components/Blocks';

import sitemap from '../../../lib/sitemap';

export const pageTitle = 'Frameworks';

const {
  React: ReactLogo,
  Angular: AngularLogo,
  Vue: VueLogo,
  Ember: EmberLogo,
  Polymer: PolymerLogo,
  Aurelia: AureliaLogo,
} = Logos;

export default generator('DocsIndex', ({ path }) => (
  <Page>
    <Head>
      <title>Storybook Documentation</title>
    </Head>
    <TopNav {...{ path }} />
    <PageTitle minHeight="auto" {...{ path }}>
      <h1>Documentation</h1>
      <p>This section contains full documentation concerning API, CLI and configuration</p>
    </PageTitle>
    <Container vPadding={30} hPadding={30}>
      <H1>Supported UI libraries / frameworks</H1>
      <Blocks
        max={6}
        colors={[
          'rgba(83, 193, 222, 0.3)',
          'rgba(65, 184, 131, 0.3)',
          'rgba(195, 0, 47, 0.3)',
          'rgba(226, 75, 49, 0.3)',
          'rgba(48, 63, 159, 0.3)',
          'rgba(126, 46, 122, 0.3)',
        ]}
      >
        <BlockLink href="http://example.com">
          <ReactLogo />
        </BlockLink>
        <BlockLink href="http://example.com">
          <VueLogo />
        </BlockLink>
        <BlockLink href="http://example.com">
          <BlockLabel>next release</BlockLabel>
          <AngularLogo />
        </BlockLink>
        <BlockLink href="http://example.com">
          <BlockLabel>on roadmap</BlockLabel>
          <EmberLogo />
        </BlockLink>
        <BlockLink href="http://example.com">
          <BlockLabel>in progress</BlockLabel>
          <PolymerLogo />
        </BlockLink>
        <BlockLink href="http://example.com">
          <BlockLabel>consideration</BlockLabel>
          <AureliaLogo />
        </BlockLink>
      </Blocks>
    </Container>

    <Container width="100%" vSpacing={30} hPadding={10}>
      <h1>Storybook Addons</h1>
      <Blocks aligned={false} variant="masked" padded>
        {sitemap['/docs/frameworks'].files
          .map(i => sitemap[i])
          .filter(i => i.name !== 'index')
          .map(data => (
            <section>
              <h2>{data.title}</h2>
            </section>
          ))}
      </Blocks>
    </Container>
  </Page>
));
