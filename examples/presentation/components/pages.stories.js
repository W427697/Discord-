import React from 'react';
import { storiesOf } from '@storybook/react';

import { TitlePage, IsolatedPage, CodePage } from './page';

const notes = `
  # Pages types

  You can use these components as the main page.
`;

storiesOf('Core|Page', module)
  .addParameters({
    notes,
  })
  .add('TitlePage', () => <TitlePage>Content</TitlePage>)
  .add('IsolatedPage', () => <IsolatedPage>Content</IsolatedPage>)
  .add('CodePage', () => (
    <CodePage>{`
      <div>Content</div>
    `}</CodePage>
  ));
