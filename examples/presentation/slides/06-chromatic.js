import React from 'react';
import { storiesOf } from '@storybook/react';

import { TitlePage } from '../components/page';
import Heading from '../components/heading';
import Hr from '../components/hr';
import ChromaticLogo from '../other/chromatic';

storiesOf('Slides|chromatic', module)
  .add('so much review', () => (
    <TitlePage>
      <Heading type="sub" mods={['centered']}>
        problem:
      </Heading>
      <Heading type="main" mods={['centered']}>
        So much to review! 🤖
      </Heading>
    </TitlePage>
  ))

  .add('logo', () => (
    <TitlePage>
      <center>
        <ChromaticLogo />
      </center>
      <br />
      <Heading type="main" mods={['centered']}>
        Visual review, diff on every commit
      </Heading>
      <Hr />
      <Heading type="main" mods={['centered']}>
        Get approval from non-tech team member
      </Heading>
      <Hr />
      <Heading type="main" mods={['centered']}>
        Merge with confidence
      </Heading>
    </TitlePage>
  ));
