import React from 'react';

import { TitlePage } from '../components/page';
import Heading from '../components/heading';
import Hr from '../components/hr';

export default {
  title: 'Slides|core',
};

export const isolation = () => (
  <TitlePage>
    <Heading type="main" mods={['centered']}>
      Isolation is the possible result of good abstraction
    </Heading>
  </TitlePage>
);

isolation.story = {
  name: 'isolation',
};

export const swappable = () => (
  <TitlePage>
    <Heading type="main" mods={['centered']}>
      An isolated component can be 🔃 by a similar one
    </Heading>
  </TitlePage>
);

swappable.story = {
  name: 'swappable',
};

export const api = () => (
  <TitlePage>
    <Heading type="main" mods={['centered']}>
      The API of your component
    </Heading>
    <Hr />
    <Heading type="sub" mods={['centered']}>
      Isolated pieces will have some API for communication
    </Heading>
    <Heading type="sub" mods={['centered']}>
      It's this API, <em>the props if you will,</em> that will determine if your component will be
      😍 or 🤬
    </Heading>
  </TitlePage>
);

api.story = {
  name: 'API',
};

export const howMuch = () => (
  <TitlePage>
    <Heading type="main" mods={['centered']}>
      The trade off in isolation ⚖️
    </Heading>
    <Hr />
    <Heading type="sub" mods={['centered']}>
      If your component isolates too much...
    </Heading>
    <Heading type="sub" mods={['centered']}>
      The API will either have to grow to compensate for it's multitude of use-cases; increasing the{' '}
      <strong>complexity</strong>.
    </Heading>
  </TitlePage>
);

howMuch.story = {
  name: 'how much',
};
