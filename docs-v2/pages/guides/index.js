import React from 'react';

import Head from 'next/head';
import { Logos } from '@storybook/components';

import Page, { generator } from '../../components/Page';

import Link from '../../components/Link';
import TopNav from '../../components/TopNav';
import PageTitle from '../../components/PageTitle';
import Blocks, { BlockLink } from '../../components/Blocks';
import Container from '../../components/Container';
import { Container as MarkdownContainer, H2, H3 } from '../../components/Markdown';

const { React: ReactLogo, Angular: AngularLogo, Vue: VueLogo, Polymer: PolymerLogo } = Logos;

export const pageTitle = 'Guides';

export default generator('GuidesIndex', ({ path }) => (
  <Page>
    <Head>
      <title>Storybook Guides</title>
    </Head>
    <TopNav {...{ path }} />
    <PageTitle minHeight="auto" {...{ path }}>
      <h1>Guides</h1>
      <p>
        This section contains guides for understanding and mastering the wide variety of usages and
        features that Storybook offers. There are guides on the core concepts, installation / setup,
        customizing configuration, etc.
      </p>
    </PageTitle>
    <Container width={1000} vSpacing={30} hPadding={10}>
      <H2 as="h1">Using storybook</H2>
      <Blocks aligned={false} colors={['transparent']} hSpacing={30}>
        <section>
          <H3 as="h2">Why Storybook</H3>
          <MarkdownContainer>
            <p>
              Read about the{' '}
              <Link href="/guides/why/">
                <a>Concept</a>
              </Link>{' '}
              behind storybook, why you'll want to use it.
            </p>
            <p>
              Learn about the flexibility by using{' '}
              <Link href="/guides/understanding/#addons-5">
                <a>Addons</a>
              </Link>,{' '}
              <Link href="/guides/understanding/#decorators-5">
                <a>Decorators</a>
              </Link>{' '}
              and other{' '}
              <Link href="/guides/understanding/#integration-5">
                <a>Integrations</a>
              </Link>.
            </p>
          </MarkdownContainer>
        </section>
        <section>
          <H3 as="h2">Setup Storybook</H3>
          <MarkdownContainer>
            <p>
              Get started with storybook! How to{' '}
              <Link href="/guides/setup/#using-the-storybook-cli-2">
                <a>install using the CLI</a>
              </Link>
              {' or '}
              <Link href="/guides/manual-setup">
                <a>manually</a>
              </Link>.
            </p>
            <p>
              <Link href="/guides/writing-stories">
                <a>Write your very first story</a>
              </Link>{' '}
              about your components.
            </p>
          </MarkdownContainer>
        </section>
        <section>
          <H3 as="h2">Organise your Storybook</H3>
          <MarkdownContainer>
            <p>
              Tips on how to get the most out of your storybook and build an{' '}
              <Link href="/guides/setup">
                <a>awesome styleguide / component library</a>
              </Link>.
            </p>
            <p>
              Structure your library using{' '}
              <Link href="/guides/setup">
                <a>hierarchy</a>
              </Link>, and provide{' '}
              <Link href="/guides/setup">
                <a>documentation</a>
              </Link>{' '}
              and example usages for your components.
            </p>
          </MarkdownContainer>
        </section>
        <section>
          <H3 as="h2">Install and use addons</H3>
          <MarkdownContainer>
            <p>
              View the{' '}
              <Link href="/guides/setup">
                <a>list of the addons</a>
              </Link>{' '}
              available from the storybook team and community.
            </p>
            <p>
              Learn to{' '}
              <Link href="/guides/setup">
                <a>decorate</a>
              </Link>{' '}
              your components and link them to{' '}
              <Link href="/guides/setup">
                <a>addon Panels</a>
              </Link>.
            </p>
          </MarkdownContainer>
        </section>
        <section>
          <H3 as="h2">Customising configuration</H3>
          <MarkdownContainer>
            <p>
              Need a custom config, no problem! Customise the{' '}
              <Link href="/guides/setup">
                <a>webpack config</a>
              </Link>{' '}
              &{' '}
              <Link href="/guides/setup">
                <a>babel config</a>
              </Link>{' '}
              to your liking.
            </p>
            <p>
              You can even{' '}
              <Link href="/guides/setup">
                <a>inject global styles, headers, scripts</a>
              </Link>{' '}
              in both manager and preview.
            </p>
          </MarkdownContainer>
        </section>
      </Blocks>
    </Container>
    <Container vSpacing={30} hPadding={30}>
      <H2 as="h1">Set up storybook for your framework of choice</H2>
      <Blocks
        max={6}
        colors={[
          'rgba(83, 193, 222, 0.3)',
          'rgba(65, 184, 131, 0.3)',
          'rgba(195, 0, 47, 0.3)',
          'rgba(48, 63, 159, 0.3)',
        ]}
      >
        <BlockLink href="http://example.com">
          <ReactLogo />
        </BlockLink>
        <BlockLink href="http://example.com">
          <VueLogo />
        </BlockLink>
        <BlockLink href="http://example.com">
          <AngularLogo />
        </BlockLink>
        <BlockLink href="http://example.com">
          <PolymerLogo />
        </BlockLink>
      </Blocks>
    </Container>
    <Container width={1000} vSpacing={30} hPadding={10}>
      <H2 as="h1">Understanding storybook</H2>
      <Blocks aligned={false} colors={['transparent']} hSpacing={30}>
        <section>
          <H3 as="h2">Storybook Terminalogy</H3>
          <MarkdownContainer>
            <p>
              Understanding the wordings used when providing support, in addons, or the codebase
              will help you be more effecient with storybook.
            </p>
            <p>It's very valuable if you want to write your own addons.</p>
            <p>
              <Link href="/guides/understanding">
                <a>Read more about Storybook's Concepts & Terminalogy</a>
              </Link>
            </p>
          </MarkdownContainer>
        </section>
        <section>
          <H3 as="h2">Storybook documentation</H3>
          <MarkdownContainer>
            <p>
              Read about the technical details that will help you{' '}
              <Link href="/docs/api/">
                <a>understand the API</a>
              </Link>, work with{' '}
              <Link href="/docs/cli/">
                <a>the CLI</a>
              </Link>, etc.
            </p>
            <p>TODO: should write this section</p>
          </MarkdownContainer>
        </section>
      </Blocks>
    </Container>
    <Container
      width={1000}
      vPadding={30}
      hPadding={30}
      background="linear-gradient(135deg, rgb(109, 171, 245) 0%, rgb(162, 224, 94) 100%)"
    >
      <H2 as="h1">For development</H2>
      <Blocks colors={['transparent']} max={4}>
        <section>
          <H3>The basic first steps</H3>
          <MarkdownContainer colored={false}>
            <ul>
              <li>
                <Link href="/guides/setup">
                  <a>Understand the repository structure</a>
                </Link>
              </li>
              <li>
                <Link href="/guides/setup">
                  <a>Check out the repository</a>
                </Link>
              </li>
              <li>
                <Link href="/guides/setup">
                  <a>Bootstrap the development processes</a>
                </Link>
              </li>
            </ul>
          </MarkdownContainer>
        </section>
        <section>
          <H3>Understanding the app</H3>
          <MarkdownContainer colored={false}>
            <ul>
              <li>
                <Link href="/guides/setup">
                  <a>App architecture</a>
                </Link>
              </li>
              <li>
                <Link href="/guides/setup">
                  <a>Multiple platform support</a>
                </Link>
              </li>
              <li>
                <Link href="/guides/setup">
                  <a>Addon architecture</a>
                </Link>
              </li>
            </ul>
          </MarkdownContainer>
        </section>
        <section>
          <H3>Releasing</H3>
          <MarkdownContainer colored={false}>
            <ul>
              <li>
                <Link href="/contributing/release-guide">
                  <a>How to release</a>
                </Link>
              </li>
              <li>
                <Link href="/contributing/release-guide">
                  <a>Merge/Release strategy </a>
                </Link>
              </li>
              <li>
                <Link href="/contributing/pull-requests">
                  <a>How to make/merge pull requests</a>
                </Link>
              </li>
            </ul>
          </MarkdownContainer>
        </section>
        <section>
          <H3>Other</H3>
          <MarkdownContainer colored={false}>
            <ul>
              <li>
                <Link href="/contributing/issue-triage">
                  <a>Resolving GitHub issues</a>
                </Link>
              </li>
              <li>
                <Link href="/contributing/maintainers-avoiding-burnout">
                  <a>What to expect from maintainers</a>
                </Link>
              </li>
              <li>
                <Link href="/contributing/code-of-conduct">
                  <a>Code of Conduct</a>
                </Link>
              </li>
            </ul>
          </MarkdownContainer>
        </section>
      </Blocks>
    </Container>
  </Page>
));
