import React from 'react';

import Head from 'next/head';
import Page, { generator } from '../../components/Page';

import Link from '../../components/Link';
import TopNav from '../../components/TopNav';
import PageTitle from '../../components/PageTitle';
import Blocks from '../../components/Blocks';
import Container from '../../components/Container';
import { Container as MarkdownContainer, H2, H3 } from '../../components/Markdown';

import sitemap from '../../lib/sitemap';

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
    <Container width={1000} vSpacing={30} hPadding={10}>
      <H2 as="h1">Consumer Storybook API</H2>
      <Blocks aligned={false} colors={['transparent']} hSpacing={30}>
        <section>
          <H3 as="h2">Story API</H3>
          <MarkdownContainer>
            <p>
              <Link href="/docs/api/">
                <a>Writing stories</a>
              </Link>{' '}
              looks a lot like writing unit tests, you create a context using{' '}
              <Link href="/guides/why/#addons">
                <a>
                  <code>storiesOf()</code>
                </a>
              </Link>{' '}
              and add cases chaining off the context with{' '}
              <Link href="/guides/why/#addons">
                <a>
                  <code>.add()</code>
                </a>
              </Link>.
            </p>
          </MarkdownContainer>
        </section>

        <section>
          <H3 as="h2">CLI API</H3>
          <MarkdownContainer>
            <p>
              <Link href="/docs/api/">
                <a>Start storybook</a>
              </Link>{' '}
              or{' '}
              <Link href="/guides/why/#addons">
                <a>build a static version</a>
              </Link>{' '}
              from the{' '}
              <Link href="/guides/why/#addons">
                <a>CLI</a>
              </Link>.
            </p>
            <p>
              A list of{' '}
              <Link href="/guides/why/#addons">
                <a>all the flags and commands</a>
              </Link>{' '}
              available to you.
            </p>
          </MarkdownContainer>
        </section>

        <section>
          <H3 as="h2">Options API</H3>
          <MarkdownContainer>
            <p>
              You can set options{' '}
              <Link href="/docs/api/">
                <a>
                  from the <code>config.js</code>
                </a>
              </Link>, but it's also possible to{' '}
              <Link href="/guides/why/#addons">
                <a>set options per story</a>
              </Link>.
            </p>
            <p>
              A list of{' '}
              <Link href="/guides/why/#addons">
                <a>all the options</a>
              </Link>{' '}
              available to you.
            </p>
          </MarkdownContainer>
        </section>

        <section>
          <H3 as="h2">Addon API</H3>
          <MarkdownContainer>
            <p>
              Customize your storybook and supercharge your development, by{' '}
              <Link href="/guides/why/#addons">
                <a>adding addons to your storybook</a>
              </Link>.
            </p>
            <p>
              <Link href="/guides/why/#addons">
                <a>Create custom addons</a>
              </Link>{' '}
              yourself, analyse the story's content, wrap the story with
              <Link href="/guides/why/#addons">
                <a>decorators</a>
              </Link>, create interactivity.
            </p>
          </MarkdownContainer>
        </section>

        <section>
          <H3 as="h2">Integration API</H3>
          <MarkdownContainer>
            <p>
              Want to integrate storybook in another tool? We have an API to allow you to{' '}
              <Link href="/guides/why/#addons">
                <a>embed Storybook in an Express-app</a>
              </Link>.
            </p>
            <p>
              It's also possible to
              <Link href="/guides/why/#addons">
                <a>extract the list of stories</a>
              </Link>
              , to integrate with others apps.
            </p>
          </MarkdownContainer>
        </section>
      </Blocks>
    </Container>

    <Container
      width={1000}
      vPadding={30}
      hPadding={30}
      background="linear-gradient(135deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0) 100%)"
    >
      <H2 as="h1">Storybook configuration</H2>
      <Blocks colors={['transparent']} hSpacing={30}>
        <section>
          <H3 as="h2">Webpack</H3>
          <MarkdownContainer>
            <p>
              Storybook comes preloaded with a very{' '}
              <Link href="/docs/api/">
                <a>versitile webpack configuration</a>
              </Link>, but if this conflicts with your setup or you need something more, like custom
              loaders or resolvers, you can tweak the webpack config using{' '}
              <Link href="/docs/api/">
                <a>extend-mode</a>
              </Link>{' '}
              or{' '}
              <Link href="/docs/api/">
                <a>full-control-mode</a>
              </Link>.
            </p>
          </MarkdownContainer>
        </section>

        <section>
          <H3 as="h2">Babel</H3>
          <MarkdownContainer>
            <p>
              Storybook needs some carefully choosen{' '}
              <Link href="/docs/api/">
                <a>babel config</a>
              </Link>{' '}
              to function, however{' '}
              <Link href="/docs/api/">
                <a>it's extendable</a>
              </Link>{' '}
              if you need to add experimental or custom transformers.
            </p>
          </MarkdownContainer>
        </section>
      </Blocks>
    </Container>

    <Container
      width={1000}
      vPadding={30}
      hPadding={30}
      background="linear-gradient(to right, rgba(241,97,97,1) 0%,rgba(243,173,56,1) 100%,rgba(162,224,94,1) 100%)"
    >
      <H2 as="h1">Storybook Addons</H2>
      <Blocks aligned={false} variant="masked" padded colors={['rgba(255,255,255,0.5)']} max={5}>
        {sitemap['/docs/addons'].files
          .filter(i => i !== '/docs/addons')
          .map(i => sitemap[i])
          .map(data => (
            <section>
              <h2>{data.title}</h2>
            </section>
          ))}
      </Blocks>
    </Container>

    <Container
      width={1000}
      vPadding={30}
      hPadding={30}
      background="linear-gradient(135deg, rgb(109, 171, 245) 0%, rgb(162, 224, 94) 100%)"
    >
      <h1>For development</h1>
      <Blocks colors={['rgba(0,0,0,0.08)']} max={4} padded>
        <p>UI mantra modules API</p>
        <p>Story Store API</p>
        <p>bootstrapping the monorepo</p>
        <p>app architecture</p>
        <p>addon architecture</p>
        <p>releases</p>
        <p>open open source</p>
      </Blocks>
    </Container>
  </Page>
));
