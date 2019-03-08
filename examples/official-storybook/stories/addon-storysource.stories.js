import React from 'react';
import { storiesOf } from '@storybook/react';
import tomorrow from 'react-syntax-highlighter/dist/styles/prism/tomorrow';

import BaseButton from '../components/BaseButton';

storiesOf('Addons|Storysource', module)
  .add('default theme', () => (
    <div>
      <BaseButton label="You should be able to see prism themed story source" />
    </div>
  ))
  .add(
    'with tomorrow theme',
    () => (
      <div>
        <BaseButton label="You should be able to see tomorrow themed story source" />
      </div>
    ),
    { storySource: { style: tomorrow } }
  );
