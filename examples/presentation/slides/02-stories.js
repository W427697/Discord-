import React from 'react';
import { storiesOf } from '@storybook/react';

import { TitlePage } from '../components/page';
import Heading from '../components/heading';
import Hr from '../components/hr';

storiesOf('Slides|stories', module)
  .add('story 1', () => (
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
  ))
  // .add('story 2', () => (
  //   <TitlePage>
  //     <Heading type="main">Company 2 💰</Heading>
  //     <p>building a financial</p>
  //     <p>18 teams</p>
  //     <p>1 team is responsible for infrastructure</p>
  //     <p>1 team is responsible for back end APIs</p>
  //     <p>1 team is responsible for common UI</p>
  //     <p>as time progresses...</p>
  //     <ul>
  //       <li>dev-teams are less concerned about going to production</li>
  //       <li>
  //         when things go wrong in either of the 3 service-teams, this creates problems everywhere
  //       </li>
  //       <li>large groups of people dependent on a few individuals</li>
  //     </ul>
  //   </TitlePage>
  // ))
  .add('commonalities', () => (
    <TitlePage>
      <Heading type="sub" mods={['centered']}>
        What can we learn from this?
      </Heading>
      <Hr />
      <Heading type="main" mods={['centered']}>
        How can we build UIs to minimize this?
      </Heading>
    </TitlePage>
  ));
