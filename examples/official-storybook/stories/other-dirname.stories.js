import React from 'react';
import base from 'paths.macro';

import { storiesOf } from '@storybook/react';

import BaseButton from '../components/BaseButton';

storiesOf(`Other|${base}/Dirname Example`, module)
  .add('story 1', () => <BaseButton label="Story 1" />)
  .add('story 2', () => <BaseButton label="Story 2" />);

storiesOf(`Other|${base}/Error Overlay Example`, module)
  .add('Storybook has a React errorOverlay when a component throws an error', () => (
    <button
      onClick={() => {
        throw new Error('example error');
      }}
    >
      Test Error Overlay
    </button>
  ))
  .add('Storybook has an error', () => {
    throw new Error('example error');
  });
