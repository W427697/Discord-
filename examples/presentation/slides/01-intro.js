import React from 'react';

import { Logo } from '@storybook/components';

import { TitlePage } from '../components/page';
import Heading from '../components/heading';
import Hr from '../components/hr';
import Avatar from '../components/avatar';
import Link from '../components/link';

import imageSrc from '../other/family.jpg';

export default {
  title: 'Slides|intro',
};

export const start = () => (
  <TitlePage>
    <Heading type="mega" mods={['centered']}>
      Writing better components using
    </Heading>
    <br />
    <center>
      <Logo colored />
    </center>
  </TitlePage>
);

start.story = {
  name: 'start',
};

export const title = () => (
  <TitlePage>
    <Heading type="mega">Writing apps is hard 😞</Heading>
  </TitlePage>
);

title.story = {
  name: 'title',
};

export const questionsEstimation = () => (
  <TitlePage>
    <Heading type="main">How often are your estimations correct?</Heading>
  </TitlePage>
);

questionsEstimation.story = {
  name: 'questions - estimation',
};

export const questionsDecomposing = () => (
  <TitlePage>
    <Heading type="main" mods={['centered']}>
      Is de-composing your big application
      <br />
      into smaller applications to answer?
    </Heading>
  </TitlePage>
);

questionsDecomposing.story = {
  name: 'questions - decomposing',
};

export const theDanger = () => (
  <TitlePage>
    <Heading type="main">Distributed monolith 😱</Heading>
  </TitlePage>
);

theDanger.story = {
  name: 'the danger',
};

export const questionsDecomposing2 = () => (
  <TitlePage>
    <Heading type="sub">
      Is de-composing your big application into smaller applications to answer? 🤔
    </Heading>
  </TitlePage>
);

questionsDecomposing2.story = {
  name: 'questions - decomposing2',
};

export const yes = () => <Heading type="sub">🎊 yes 🎉</Heading>;

yes.story = {
  name: 'yes',
};

export const thankYou = () => (
  <TitlePage>
    <Heading type="main" mods={['centered']}>
      👋
    </Heading>
    <Heading type="main">Thank you for your time!</Heading>
  </TitlePage>
);

thankYou.story = {
  name: 'thank you',
};

export const aboutMe = () => (
  <TitlePage>
    <center>
      <Avatar src={imageSrc} size={20} />
    </center>
    <Heading type="section" mods={['centered']}>
      Norbert de Langen
    </Heading>
    <Hr />
    <center>
      <p>Full-time open-source maintainer of Storybook</p>
      <p>Developer Advocate at Chroma</p>
      <p>Farther, Husband</p>
      <p>I have no idea what I'm doing</p>
    </center>
    <Hr />
    <center>
      <p>
        🦆 <Link href="https://twitter.com/ndelangen">@norbertdelangen</Link>
      </p>
      <p>
        💌 <Link href="mailto:ndelangen@me.com">ndelangen@me.com</Link>
      </p>
    </center>
  </TitlePage>
);

aboutMe.story = {
  name: 'about me',
};
