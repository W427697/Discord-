import React from 'react';

import { TitlePage } from '../components/page';
import Heading from '../components/heading';
import Hr from '../components/hr';

export default {
  title: 'Slides|stories',
};

export const story1 = () => (
  <TitlePage>
    <Heading type="sub">Company 💼</Heading>
    <p>
      building a SAAS
      <br />3 teams, each team is responsible for a section or the app
    </p>
    <p>as time progresses...</p>
    <ul>
      <li>teams are making making requests to eachother</li>
      <li>blocking each other, wasting ⏱ and 💰</li>
      <li>tentions between teams rise</li>
    </ul>
  </TitlePage>
);

story1.story = {
  name: 'story 1',
};

export const commonalities = () => (
  <TitlePage>
    <Heading type="sub" mods={['centered']}>
      What can we learn from this?
    </Heading>
    <Hr />
    <Heading type="main" mods={['centered']}>
      How can we build UIs to minimize this?
    </Heading>
  </TitlePage>
);

commonalities.story = {
  name: 'commonalities',
};
