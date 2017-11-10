import React from 'react';
import glamorous from 'glamorous';
import Head from 'next/head';

import Page, { generator } from '../components/Page';
import TopNav from '../components/TopNav';

import { H1 } from '../components/Markdown';
import Hero, { HeroTitle, HeroActions } from '../components/Hero';

import Container from '../components/Container';
import Blocks from '../components/Blocks';
import Button from '../components/Button';

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

export default generator('RootExample', ({ path }) => (
  <Page>
    <TopNav {...{ path }} />
    <Head>
      <title>Storybook docs</title>
    </Head>
    <TopNav />
    <Hero>
      <HeroTitle>Presentation by maintainers and the community</HeroTitle>
      <HeroActions>
        <Button href="https://www.youtube.com/channel/UCr7Quur3eIyA_oe8FNYexfg" size={5}>
          Subscribe to the Storybook Youtube channel
        </Button>
      </HeroActions>
    </Hero>
    <Container width={1400} vSpacing={30} hPadding={30}>
      <H1>Introduction to storybook</H1>
      <Blocks max={4}>
        <Video
          title="Marie-Laure Thuret - React Storybook: Design, Dev, Doc, Debug Components - React Conf 2017"
          id="PF0Vi-iIyoo"
        />
        <Video
          title="Rafael Mendiola - Speed up your React Native Development with Storybook"
          id="SN9DKCKb13k"
        />
        <Video title="Jonas Keinholz - Storybook in React + React Native" id="rY_txciuUe4" />
        <Video title="Jonas Keinholz - Storybook in React + React Native" id="rY_txciuUe4" />
      </Blocks>
    </Container>
    <Container width={1400} vSpacing={30} hPadding={30}>
      <H1>Roadmap meetings</H1>
      <Blocks max={3}>
        <Video title="Roadmap meeting #3" id="k1SQ6gHW7nk" />
        <Video title="Roadmap meeting #2" id="DEL7XbFXPRA" />
        <Video title="Roadmap meeting #1" id="wY_rGchZnYE" />
      </Blocks>
    </Container>
    <Container width={1000} vSpacing={30} hPadding={30}>
      <H1>Random tech demos</H1>
      <Blocks max={5}>
        <Video title="Work in progress on new layout system" id="jInsVeMYTbU" />
        <Video title="1 year of OSS" id="zJ8X7Kte1Tg" />
        <Video title="Storybook for Vue demo" id="Qqce5u6upGM" />
        <Video title="Bootstrapping storybook" id="48TX61qdzqY" />
        <Video title="Publishing storybook with Lerna" id="HPI54xKKFlg" />
      </Blocks>
    </Container>
  </Page>
));
