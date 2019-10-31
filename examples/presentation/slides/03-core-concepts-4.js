import React from 'react';

import { TitlePage } from '../components/page';
import Heading from '../components/heading';
import Hr from '../components/hr';

export default {
  title: 'Slides|core',
};

export const conclusion = () => (
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
);

conclusion.story = {
  name: 'conclusion',
};

export const lessChanges = () => (
  <TitlePage>
    <Heading type="main" mods={['centered']}>
      They won't have to change as often
    </Heading>
    <Hr />
    <Heading type="sub" mods={['centered']}>
      And when they do, their use-cases are limited 👌
    </Heading>
  </TitlePage>
);

lessChanges.story = {
  name: 'less changes',
};

export const reUse = () => (
  <TitlePage>
    <Heading type="main" mods={['centered']}>
      It's easier to re-use 👏
    </Heading>
  </TitlePage>
);

reUse.story = {
  name: 're-use',
};

export const autonomy = () => (
  <TitlePage>
    <Heading type="mega" mods={['centered']}>
      🤩 Autonomy 😎
    </Heading>
  </TitlePage>
);

autonomy.story = {
  name: 'autonomy',
};
