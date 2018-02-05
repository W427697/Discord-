import React from 'react';
import base from 'paths.macro';

import { storiesOf } from '@storybook/react';

import BaseButton from '../components/BaseButton';

storiesOf(`Other|${base}/Dirname Example`, module)
  .add('story 1', () => <BaseButton label="Story 1" />)
  .add('story 2', () => <BaseButton label="Story 2" />);

function ThrowingComponent() {
  throw new Error();
}

storiesOf('Other|Error Overlay Example', module)
  .add('Storybook has a React errorOverlay when a component throws an error', () => (
    <button
      onClick={() => {
        throw new Error('example error');
      }}
    >
      Test Error Overlay
    </button>
  ))
  .add('Storybook tries to render something that throws an error', () => <ThrowingComponent />)
  .add('Storybook itself throws an error', () => {
    throw new Error('example error');
  });
