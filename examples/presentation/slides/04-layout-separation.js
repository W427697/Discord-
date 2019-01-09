import React from 'react';
import { storiesOf } from '@storybook/react';

import Heading from '../components/heading';
import { CodePage, TitlePage, IsolatedPage } from '../components/page';
import Placeholder from '../components/layout/placeholder';
import SideBySide from '../components/layout/side-by-side';

storiesOf('Slides|layout separation', module)
  .add('encapsulation again', () => (
    <TitlePage>
      <Heading type="main">Encapsulates the UI Pattern, no more, no less.</Heading>
    </TitlePage>
  ))
  .add('layout as a pattern', () => (
    <TitlePage>
      <Heading type="main">Sometimes a UI pattern can be as simple as "I want this layout"</Heading>
    </TitlePage>
  ))
  .add('layout as a pattern', () => (
    <CodePage scope={{ SideBySide, Placeholder }}>{`
      <SideBySide>
        <Placeholder color="hotpink">content</Placeholder>
        <Placeholder color="deepskyblue">content</Placeholder>
      </SideBySide>
    `}</CodePage>
  ))

  .add('layout as a pattern isolated', () => (
    <IsolatedPage>
      <SideBySide>
        <Placeholder color="hotpink">content</Placeholder>
        <Placeholder color="deepskyblue">content</Placeholder>
      </SideBySide>
    </IsolatedPage>
  ));
