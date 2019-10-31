import React from 'react';

import { TitlePage } from '../components/page';
import Heading from '../components/heading';
import Hr from '../components/hr';

export default {
  title: 'Slides|core',
};

export const abstraction = () => (
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
);

abstraction.story = {
  name: 'abstraction',
};

export const knight = () => (
  <TitlePage>
    <Heading type="main" mods={['centered']}>
      If developers are like 🤺 fighting complexity...
    </Heading>
  </TitlePage>
);

knight.story = {
  name: 'knight',
};

export const dragon = () => (
  <TitlePage>
    <Heading type="main" mods={['centered']}>
      Complexity is the 🐉
    </Heading>
    <Heading type="sub" mods={['centered']}>
      If we fail to ⚔️ it effectively, we feed it.
    </Heading>
  </TitlePage>
);

dragon.story = {
  name: 'dragon',
};

export const understanding = () => (
  <TitlePage>
    <Heading type="main" mods={['centered']}>
      To create correct abstractions
    </Heading>
    <Heading type="sub" mods={['centered']}>
      We must understand the problem well
    </Heading>
  </TitlePage>
);

understanding.story = {
  name: 'understanding',
};

export const artOfWar = () => (
  <TitlePage>
    <blockquote>
      “If you know the enemy and know yourself, you need not fear the result of a hundred battles.
      <br />
      If you know yourself but not the enemy, for every victory gained you will also suffer a
      defeat.
      <br />
      If you know neither the enemy nor yourself, you will succumb in every battle.”
    </blockquote>
    <Heading type="sub" mods={['centered']}>
      ― Sun Tzu, The Art of War
    </Heading>
  </TitlePage>
);

artOfWar.story = {
  name: 'art of war',
};
