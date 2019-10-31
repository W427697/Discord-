import React from 'react';

import { TitlePage } from '../components/page';
import Heading from '../components/heading';
import Hr from '../components/hr';

export default {
  title: 'Slides|core',
};

export const concepts = () => (
  <TitlePage>
    <Heading type="main" mods={['centered']}>
      Abstraction, Isolation, Autonomy
    </Heading>
  </TitlePage>
);

concepts.story = {
  name: 'concepts',
};
