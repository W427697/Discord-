import React from 'react';

import Head from 'next/head';
import { Logos } from '@storybook/components';

import Page, { generator } from '../../components/Page';

import Link from '../../components/Link';
import TopNav from '../../components/TopNav';
import PageTitle from '../../components/PageTitle';
import Blocks, { BlockLink, BlockLabel } from '../../components/Blocks';
import Container from '../../components/Container';
import { Container as MarkdownContainer, H1, H2, H3 } from '../../components/Markdown';

const {
  React: ReactLogo,
  Angular: AngularLogo,
  Vue: VueLogo,
  Ember: EmberLogo,
  Polymer: PolymerLogo,
  Aurelia: AureliaLogo,
} = Logos;

export default generator('GuidesIndex', ({ path }) => (
  <Page>
    <Head>
      <title>Storybook Guides</title>
    </Head>
    <TopNav {...{ path }} />
    <PageTitle minHeight="auto">
      <h1>Guides</h1>
      <p>
        This section contains guides for understanding and mastering the wide variety of usages and
        features that Storybook offers. There are guides on the core concepts, installation / setup,
        customizing configuration, etc.
      </p>
    </PageTitle>
    <Container width={1000} vSpacing={30} hPadding={10}>
      <H2 as="h1">For using storybook</H2>
      <Blocks aligned={false} padded variant="masked">
        <section>
          <H3>Why Storybook</H3>
          <MarkdownContainer>
            <ol>
              <li>
                <Link href="/guides/why/">
                  <a>Concept</a>
                </Link>
              </li>
              <li>
                <Link href="/guides/why/#decorators">
                  <a>Decorators</a>
                </Link>
              </li>
              <li>
                <Link href="/guides/why/#addons">
                  <a>Addons</a>
                </Link>
              </li>
              <li>
                <Link href="/guides/why/#integration">
                  <a>Integration</a>
                </Link>
              </li>
            </ol>
          </MarkdownContainer>
        </section>
        <section>
          <H3>Setup Storybook</H3>
          <MarkdownContainer>
            <ol>
              <li>Automatic setup</li>
              <li>Add storybook manually</li>
              <li>Writing stories</li>
            </ol>
          </MarkdownContainer>
        </section>
        <section>
          <H3>Organising your storybook</H3>
          <MarkdownContainer>
            <ol>
              <li>Building a styleguide / component library</li>
              <li>Hierarchy</li>
              <li>Providing documentation</li>
            </ol>
          </MarkdownContainer>
        </section>
        <section>
          <H3>Adding and using addons</H3>
          <MarkdownContainer>
            <ol>
              <li>Addons as decorators</li>
              <li>Addon panels</li>
              <li>List of addons available</li>
            </ol>
          </MarkdownContainer>
        </section>
        <section>
          <H3>Customising configuration</H3>
          <MarkdownContainer>
            <ol>
              <li>Customise webpack config</li>
              <li>Custom babel config</li>
              <li>Adding global CSS & fonts</li>
            </ol>
          </MarkdownContainer>
        </section>
      </Blocks>
    </Container>
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
          <BlockLabel>consideration</BlockLabel>
          <PolymerLogo />
        </BlockLink>
        <BlockLink href="http://example.com">
          <BlockLabel>consideration</BlockLabel>
          <AureliaLogo />
        </BlockLink>
      </Blocks>
    </Container>
    <Container
      width={1000}
      vPadding={30}
      hPadding={30}
      background="linear-gradient(135deg, rgb(109, 171, 245) 0%, rgb(162, 224, 94) 100%)"
    >
      <H1>For development</H1>
      <Blocks colors={['rgba(0,0,0,0.08)']} max={4} padded>
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
