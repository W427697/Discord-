import React from 'react';

import Head from 'next/head';
import { Logos } from '@storybook/components';

import Page, { generator } from '../../components/Page';

import Link from '../../components/Link';
import Button from '../../components/Button';
import TopNav from '../../components/TopNav';
import PageTitle from '../../components/PageTitle';
import Blocks, { BlockLink } from '../../components/Blocks';
import Container from '../../components/Container';
import { Container as MarkdownContainer, H1, H2, H3 } from '../../components/Markdown';

const { React: ReactLogo, Angular: AngularLogo, Vue: VueLogo, Polymer: PolymerLogo } = Logos;

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
      <Blocks aligned={false} variant="bordered" colors={['rgba(0,0,0,0.1)']}>
        <section style={{ padding: 18 }}>
          <H3>Why Storybook</H3>
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
              <Link href="/guides/why/#addons">
                <a>Addons</a>
              </Link>,{' '}
              <Link href="/guides/why/#decorators">
                <a>Decorators</a>
              </Link>{' '}
              and other{' '}
              <Link href="/guides/why/#integration">
                <a>Integrations</a>
              </Link>.
            </p>
          </MarkdownContainer>
        </section>
        <section style={{ padding: 18 }}>
          <H3>Setup Storybook</H3>
          <MarkdownContainer>
            <p>
              Get started with storybook! How to{' '}
              <Link href="/guides/setup">
                <a>install using the CLI</a>
              </Link>
              {' or '}
              <Link href="/guides/setup">
                <a>manually</a>
              </Link>.
            </p>
            <p>
              <Link href="/guides/setup">
                <a>Write your very first story</a>
              </Link>{' '}
              about your components.
            </p>
          </MarkdownContainer>
        </section>
        <section style={{ padding: 18 }}>
          <H3>Organise your Storybook</H3>
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
        <section style={{ padding: 18 }}>
          <H3>Install and use addons</H3>
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
        <section style={{ padding: 18 }}>
          <H3>Customising configuration</H3>
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
      <H1>Set up storybook for your framework of choice</H1>
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
    <Container
      width={1000}
      vPadding={30}
      hPadding={30}
      background="linear-gradient(135deg, rgb(109, 171, 245) 0%, rgb(162, 224, 94) 100%)"
    >
      <H1>For development</H1>
      <Blocks colors={['rgba(0,0,0,0.08)']} max={4}>
        <section style={{ padding: 18 }}>
          <H3>The basic first steps</H3>
          <p>
            <Link href="/guides/setup">
              <Button>Understand the repository structure</Button>
            </Link>
          </p>
          <p>
            <Link href="/guides/setup">
              <Button>Check out the repository</Button>
            </Link>
          </p>
          <p>
            <Link href="/guides/setup">
              <Button>Bootstrap the development processes</Button>
            </Link>
          </p>
        </section>
        <section style={{ padding: 18 }}>
          <H3>Understanding the app</H3>
          <p>
            <Link href="/guides/setup">
              <Button>App architecture</Button>
            </Link>
          </p>
          <p>
            <Link href="/guides/setup">
              <Button>Multiple platform support</Button>
            </Link>
          </p>
          <p>
            <Link href="/guides/setup">
              <Button>Addon architecture</Button>
            </Link>
          </p>
        </section>
        <section style={{ padding: 18 }}>
          <H3>Releasing</H3>
          <p>
            <Link href="/guides/setup">
              <Button>How to release</Button>
            </Link>
          </p>
          <p>
            <Link href="/guides/setup">
              <Button>Merge/Release strategy </Button>
            </Link>
          </p>
        </section>
        <section style={{ padding: 18 }}>
          <H3>Other</H3>
          <p>
            <Link href="/guides/setup">
              <Button>What to expect from maintainers</Button>
            </Link>
          </p>
        </section>
      </Blocks>
    </Container>
  </Page>
));
