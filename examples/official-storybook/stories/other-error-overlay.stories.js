import React from 'react';
import { storiesOf } from '@storybook/react';

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
