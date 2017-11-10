import React from 'react';

import Head from 'next/head';
import Page, { generator } from '../../components/Page';

import Link from '../../components/Link';
import TopNav from '../../components/TopNav';
import PageTitle from '../../components/PageTitle';
import Blocks from '../../components/Blocks';
import Container from '../../components/Container';
import SideNav from '../../components/SideNav';
import { Container as MarkdownContainer } from '../../components/Markdown';

import sitemap from '../../lib/sitemap';

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
    <MarkdownContainer>
      <Container width={1000} vSpacing={30} hPadding={10}>
        <h1>Consumer Storybook API</h1>
        <Blocks aligned={false} variant="masked" padded>
          <section>
            <h2>Stories API</h2>
            <Link href="/docs/api">
              <a>Writing stories</a>
            </Link>
          </section>
          <section>
            <h2>setAddon API</h2>
          </section>
          <section>
            <h2>Addon panels API</h2>
          </section>
          <section>
            <h2>setOptions API</h2>
          </section>
          <section>
            <h2>storyshorts</h2>
          </section>
          <section>
            <h2>UI API</h2>
          </section>
        </Blocks>
      </Container>
      <Container width={1000} vSpacing={30} hPadding={10}>
        <h1>Storybook CLI</h1>
        <Blocks aligned={false} variant="masked" padded>
          <section>
            <h2>Get Storybook CLI</h2>
          </section>
          <section>
            <h2>React App CLI</h2>
          </section>
          <section>
            <h2>Storyshots CLI</h2>
          </section>
          <section>
            <h2>Storybook deployer CLI</h2>
          </section>
        </Blocks>
      </Container>
      <Container vSpacing={30} hPadding={10}>
        <h1>Storybook Addons</h1>
        <Blocks aligned={false} variant="masked" padded>
          {sitemap['/docs/addons'].files.map(i => sitemap[i]).map(data => (
            <section>
              <h2>{data.title}</h2>
            </section>
          ))}
        </Blocks>
      </Container>

      <Container width={1000} vSpacing={30} hPadding={10}>
        <h1>Configuration</h1>
        <SideNav {...{ sitemap, path }} />
        <Blocks aligned={false} variant="masked" padded>
          <section>
            <h2>Webpack</h2>
          </section>
          <section>
            <h2>Storyshorts</h2>
          </section>
          <section>
            <h2>config.js</h2>
            <span>
              Rename to <code>stories_config.js</code>?
            </span>
          </section>
          <section>
            <h2>addons.js</h2>
            <span>
              Rename to <code>addons_config.js</code>?
            </span>
          </section>
        </Blocks>
      </Container>
      <Container width={1000} vSpacing={30} hPadding={10}>
        <h1>Built-in Addons API</h1>
        <Blocks aligned={false} variant="masked" padded>
          <section>
            <h2>LinkTo</h2>
          </section>
          <section>
            <h2>Actions</h2>
          </section>
          <section>
            <h2>Knobs</h2>
          </section>
          <section>
            <h2>Info</h2>
          </section>
          <section>
            <h2>Notes</h2>
          </section>
        </Blocks>
      </Container>
      <Container width={1000} vSpacing={30} hPadding={10}>
        <h1>Third-party Addons API</h1>
        <Blocks aligned={false} variant="masked" padded>
          <section>
            <h2>Specs</h2>
          </section>
          <section>
            <h2>Intl</h2>
          </section>
          <section>
            <h2>JSX preview</h2>
          </section>
        </Blocks>
      </Container>
      <Container width={1000} vSpacing={30} hPadding={10}>
        <h1>Internal Storybook API (for developers)</h1>
        <Blocks aligned={false} variant="masked" padded>
          <section>
            <h2>UI mantra modules API</h2>
          </section>
          <section>
            <h2>Story Store API</h2>
          </section>
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
          <p>bootstrapping the monorepo</p>
          <p>app architecture</p>
          <p>addon architecture</p>
          <p>releases</p>
          <p>open open source</p>
          <p>...</p>
        </Blocks>
      </Container>
    </MarkdownContainer>
  </Page>
));
