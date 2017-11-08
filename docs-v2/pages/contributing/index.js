import React from 'react';

import Head from 'next/head';
import Page, { generator } from '../../components/Page';

import Link from '../../components/Link';
import TopNav from '../../components/TopNav';
import PageTitle from '../../components/PageTitle';
import Blocks, { BlockLink, BlockLabel } from '../../components/Blocks';
import Container from '../../components/Container';
import { Container as MarkdownContainer, H1, H2, H3 } from '../../components/Markdown';

import ReactLogo from '../../components/logos/React';
import AngularLogo from '../../components/logos/Angular';
import VueLogo from '../../components/logos/Vue';
import EmberLogo from '../../components/logos/Ember';
import PolymerLogo from '../../components/logos/Polymer';
import AureliaLogo from '../../components/logos/Aurelia';

export default generator('GuidesIndex', ({ path }) => (
  <Page>
    <Head>
      <title>Storybook Guides</title>
    </Head>
    <TopNav {...{ path }} />
    <PageTitle minHeight="auto">
      <h1>Contributing to Storybook</h1>
    </PageTitle>
    <Container width={1000} vSpacing={30} hPadding={10}>
      <H2 as="h1">For using storybook</H2>
      <p>
        Thanks for your interest in improving Storybook! We are a community-driven project and
        welcome contributions of all kinds: from discussion to documentation to bugfixes to feature
        improvements. Please review these guides to help to streamline the process and save
        everyone's precious time.
      </p>
      <p>
        <strong>
          This repo uses yarn workspaces, so you should `yarn@1.0.0` or higher as package manager.
        </strong>
      </p>
      <Blocks aligned={false} padded variant="masked">
        {/* TODO: UPDATE THIS: */}
        <section>
          <H3>Reporting Issues </H3>
          <MarkdownContainer>
            <ol>
              <li>
                <Link href="/contributing/why/">
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
  </Page>
));
