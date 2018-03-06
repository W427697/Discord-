import React from 'react';
import glamorous from 'glamorous';

import Head from 'next/head';

import Page, { generator } from '../../components/Page';

import Link from '../../components/Link';
import TopNav from '../../components/TopNav';
import PageTitle from '../../components/PageTitle';
import Blocks from '../../components/Blocks';
import Container from '../../components/Container';
import { Container as MarkdownContainer, H1, H2, H3 } from '../../components/Markdown';

export const pageTitle = 'Contributing to Storybook';

const Video = glamorous(({ id, title, className }) => (
  <div className={className}>
    <iframe
      title={title}
      width="560"
      height="315"
      src={`https://www.youtube.com/embed/${id}`}
      frameBorder="0"
      gesture="media"
      allowFullScreen
    />
  </div>
))({
  width: '100%',
  position: 'relative',
  '&:before': {
    display: 'block',
    content: '""',
    width: '100%',
    paddingTop: '56.25%',
  },
  '& > iframe': {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
});

export default generator('GuidesIndex', ({ path }) => (
  <Page>
    <Head>
      <title>Storybook Guides</title>
    </Head>
    <TopNav {...{ path }} />
    <PageTitle minHeight="auto">
      <h1>{pageTitle}</h1>
    </PageTitle>
    <Container width={1000} vSpacing={30} hPadding={10}>
      <H2 as="h1">For using storybook</H2>
      <MarkdownContainer>
        <p>
          Thanks for your interest in improving Storybook! We are a community-driven project and
          welcome contributions of all kinds: from discussion to documentation to bugfixes to
          feature improvements. Please review these guides to help to streamline the process and
          save everyone's precious time.
        </p>
        <p>
          <strong>
            This repo uses yarn workspaces, so you should{' '}
            <a href="https://yarnpkg.com/lang/en/docs/install/">install `yarn@1.0.0`</a> or higher
            as package manager.<br />
            <Link href="/contributing/setting-up-a-dev-environment">
              <a>See here for a full explanation on how to get a dev setup</a>
            </Link>.
          </strong>
        </p>
      </MarkdownContainer>
    </Container>
    <Container width={1000} vSpacing={30} hPadding={10}>
      <Blocks aligned={false} colors={['transparent']} hSpacing={30}>
        <section style={{ padding: 18 }}>
          <H3>The basic first steps</H3>
          <MarkdownContainer>
            <ol>
              <li>
                <Link href="/contributing/setting-up-a-dev-environment">
                  <a>Understand the repository structure</a>
                </Link>
              </li>
              <li>
                <Link href="/contributing/setting-up-a-dev-environment">
                  <a>Check out the repository</a>
                </Link>
              </li>
              <li>
                <Link href="/contributing/setting-up-a-dev-environment">
                  <a>Bootstrap the development processes</a>
                </Link>
              </li>
            </ol>
          </MarkdownContainer>
        </section>
        <section style={{ padding: 18 }}>
          <H3>Understanding the app</H3>
          <MarkdownContainer>
            <ol>
              <li>
                <Link href="/docs/architecture">
                  <a>App architecture</a>
                </Link>
              </li>
              <li>
                <Link href="/docs/architecture">
                  <a>Multiple platform support</a>
                </Link>
              </li>
              <li>
                <Link href="/docs/architecture">
                  <a>Addon architecture</a>
                </Link>
              </li>
            </ol>
          </MarkdownContainer>
        </section>
        <section style={{ padding: 18 }}>
          <H3>Releasing</H3>
          <MarkdownContainer>
            <ol>
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
            </ol>
          </MarkdownContainer>
        </section>
        <section style={{ padding: 18 }}>
          <H3>Non-code</H3>
          <MarkdownContainer>
            <ol>
              <li>
                <Link href="/contributing/maintainers-avoiding-burnout">
                  <a>Writing and translating documentation</a>
                </Link>
              </li>
              <li>
                <Link href="/contributing/issue-triage">
                  <a>Issue triage</a>
                </Link>
              </li>
            </ol>
          </MarkdownContainer>
        </section>
        <section style={{ padding: 18 }}>
          <H3>Other</H3>
          <MarkdownContainer>
            <ol>
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
              <li>
                <Link href="/contributing/code-of-conduct">
                  <a>Supporting storybook financially</a>
                </Link>
              </li>
            </ol>
          </MarkdownContainer>
        </section>
      </Blocks>
    </Container>
    <Container
      width={700}
      vSpacing={30}
      vPadding={30}
      hPadding={10}
      background="linear-gradient(135deg, #2ab5bb 8%, #2a7bbb)"
    >
      <H1>Follow along with a 'first PR on the storybook codebase'-video</H1>
      <Video id="4GC0jGODGeY" title="This video hasn't been made yet" />
    </Container>
    <Container width={1000} vSpacing={30} vPadding={30} hPadding={10}>
      <MarkdownContainer>
        <p>
          Need material for a storybook presentation of your own, or want inspiration? Check out our{' '}
          <a href="https://github.com/storybooks/press">press repository</a> and the{' '}
          <Link href="/videos">
            <a>videos page</a>
          </Link>.
        </p>
      </MarkdownContainer>
    </Container>
  </Page>
));
