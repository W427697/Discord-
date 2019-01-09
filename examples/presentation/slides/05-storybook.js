import React from 'react';
import { storiesOf } from '@storybook/react';

import { withKnobs, boolean, text } from '@storybook/addon-knobs';

import { Logo } from '@storybook/components';

import { TitlePage } from '../components/page';
import Heading from '../components/heading';
import Hr from '../components/hr';

storiesOf('Slides|storybook', module)
  .addDecorator(
    withKnobs({
      escapeHTML: false,
    })
  )
  .add('embrace components', () => (
    <TitlePage>
      <Heading type="sub" mods={['centered']}>
        Key take away
      </Heading>
      <Hr />
      <Heading type="main" mods={['centered']}>
        Embrace using components beyond the visual 🤗
      </Heading>
    </TitlePage>
  ))
  .add('too many components', () => (
    <TitlePage>
      <Heading type="sub" mods={['centered']}>
        problem:
      </Heading>
      <Hr />
      <Heading type="main" mods={['centered']}>
        So many components! 🤯
      </Heading>
    </TitlePage>
  ))
  .add('enter storybook', () => {
    const bool = boolean('colored', true);
    const width = text('width', '50vw');
    return (
      <TitlePage>
        <Heading type="sub" mods={['centered']}>
          solution:
        </Heading>
        {bool ? <Logo colored width={width} /> : <Logo width={width} />}
      </TitlePage>
    );
  })
  .add('add addons', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        Add your own addons 🧩
      </Heading>
    </TitlePage>
  ))
  .add('add tests', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        Get all stories snapshotted 📸
      </Heading>
    </TitlePage>
  ))
  .add('add integration', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        Extract all stories known to storybook
      </Heading>
      <Hr />
      <Heading type="main" mods={['centered']}>
        get the rendered html, url 🚛
      </Heading>
    </TitlePage>
  ));
