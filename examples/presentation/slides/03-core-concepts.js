import React from 'react';
import { storiesOf } from '@storybook/react';

import { TitlePage } from '../components/page';
import Heading from '../components/heading';
import Hr from '../components/hr';

storiesOf('Slides|core', module).add('concepts', () => (
  <TitlePage>
    <Heading type="main" mods={['centered']}>
      Abstraction, Isolation, Autonomy
    </Heading>
  </TitlePage>
));

storiesOf('Slides|core', module)
  .add('abstraction', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        Good abstraction is the 🔑 to good software
      </Heading>
      <Hr />
      <Heading type="sub" mods={['centered']}>
        If you create abstractions where you shouldn't you'll get <strong>complexity</strong>
      </Heading>
      <Heading type="sub" mods={['centered']}>
        If you don't create abstractions where you should you'll get <strong>complexity</strong>
      </Heading>
    </TitlePage>
  ))
  .add('knight', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        If developers are like 🤺 fighting complexity...
      </Heading>
    </TitlePage>
  ))
  .add('dragon', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        Complexity is the 🐉
      </Heading>
      <Heading type="sub" mods={['centered']}>
        If we fail to ⚔️ it effectively, we feed it.
      </Heading>
    </TitlePage>
  ))
  .add('understanding', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        To create correct abstractions
      </Heading>
      <Heading type="sub" mods={['centered']}>
        We must understand the problem well
      </Heading>
    </TitlePage>
  ));

storiesOf('Slides|core', module)
  .add('isolation', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        Isolation is the possible result of good abstraction
      </Heading>
    </TitlePage>
  ))
  .add('API', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        The API of your component
      </Heading>
      <Hr />
      <Heading type="sub" mods={['centered']}>
        Isolated pieces will have some API for communication
      </Heading>
      <Heading type="sub" mods={['centered']}>
        It's this API, <em>the props</em> that will determine if your component will be 😍 or 🤬
      </Heading>
    </TitlePage>
  ))
  .add('how much', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        The trade off in isolation ⚖️
      </Heading>
      <Hr />
      <Heading type="sub" mods={['centered']}>
        If your component isolates too much...
      </Heading>
      <Heading type="sub" mods={['centered']}>
        The API will either have to grow to compensate for it's multitude of use-cases; increasing
        the <strong>complexity</strong>.
      </Heading>
    </TitlePage>
  ));

storiesOf('Slides|core', module)
  .add('conclusion', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        When components:
      </Heading>
      <Hr />
      <Heading>0️⃣ Abstract the right amount of stuff</Heading>
      <Heading>1️⃣ Isolate enough but to too much</Heading>
      <Heading>2️⃣ Have a good API to do things</Heading>
      <Hr />
      <Heading type="main" mods={['centered']}>
        then...
      </Heading>
    </TitlePage>
  ))
  .add('less changes', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        They won't have to change as often
      </Heading>
      <Hr />
      <Heading type="sub" mods={['centered']}>
        And when they do, their use-cases are limited 👌
      </Heading>
    </TitlePage>
  ))
  .add('re-use', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        It's easier to re-use 👏
      </Heading>
    </TitlePage>
  ))
  .add('autonomy', () => (
    <TitlePage>
      <Heading type="mega" mods={['centered']}>
        🤩 Autonomy 😎
      </Heading>
    </TitlePage>
  ));
