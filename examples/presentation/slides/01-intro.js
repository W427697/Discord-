import React from 'react';
import { storiesOf } from '@storybook/react';

import { Logo } from '@storybook/components';

import { TitlePage } from '../components/page';
import Heading from '../components/heading';
import Hr from '../components/hr';
import Avatar from '../components/avatar';
import Link from '../components/link';

import imageSrc from '../other/family.jpg';

storiesOf('Slides|intro', module)
  .add(
    'start',
    () => (
      <TitlePage>
        <Heading type="mega" mods={['centered']}>
          Writing better components using
        </Heading>
        <br />
        <center>
          <Logo colored />
        </center>
      </TitlePage>
    ),
    { notes: 'test' }
  )
  .add('title', () => (
    <TitlePage>
      <Heading type="mega">Writing apps is hard 😞</Heading>
    </TitlePage>
  ))
  .add('questions - estimation', () => (
    <TitlePage>
      <Heading type="main">How often are your estimations correct?</Heading>
    </TitlePage>
  ))
  .add('questions - decomposing', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        Is de-composing your big application
        <br />
        into smaller applications the answer?
      </Heading>
    </TitlePage>
  ))
  .add('the danger', () => (
    <TitlePage>
      <Heading type="main">Distributed monolith 😱</Heading>
    </TitlePage>
  ))
  .add('questions - decomposing2', () => (
    <TitlePage>
      <Heading type="sub">
        Is de-composing your big application into smaller applications the answer? 🤔
      </Heading>
    </TitlePage>
  ))
  .add('yes', () => <Heading type="sub">🎊 yes 🎉</Heading>)
  .add('thank you', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        👋
      </Heading>
      <Heading type="main">Thank you for your time!</Heading>
    </TitlePage>
  ))
  .add('about me', () => (
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
        <p>Father, Husband</p>
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
  ));
