import React from 'react';
import { storiesOf } from '@storybook/react';

import { TitlePage } from '../components/page';
import Heading from '../components/heading';

storiesOf('Slides|future', module)
  .add('future storybook features', () => (
    <TitlePage>
      <Heading type="mega" mods={['centered']}>
        What does the future bring? 🕰
      </Heading>
    </TitlePage>
  ))
  .add('new formats', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        new story format(s), including mdx support 📑
      </Heading>
    </TitlePage>
  ))
  .add('docs mode', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        a viewmode for documentation focus 📖
      </Heading>
    </TitlePage>
  ))
  .add('typescript', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        better typescript support 🧂
      </Heading>
    </TitlePage>
  ))
  .add('edit code', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        edit code from within storybook 📝
      </Heading>
    </TitlePage>
  ))
  .add('new improved ui', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        new improved UI, more theming options 🎨
      </Heading>
    </TitlePage>
  ))
  .add('more apis', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        more addon apis, new types of addons 🧩
      </Heading>
    </TitlePage>
  ))
  .add('more frameworks supported', () => (
    <TitlePage>
      <Heading type="main" mods={['centered']}>
        always more frameworks to support 🏗
      </Heading>
    </TitlePage>
  ));
