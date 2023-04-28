/* eslint-disable react/button-has-type */
import React from 'react';

import { storiesOf } from '@junk-temporary-prototypes/react';
import { action } from '@junk-temporary-prototypes/addon-actions';

storiesOf('Another Button', module)
  .add('with text', () => <button onClick={action('clicked')}>Hello button</button>)
  .add('with some emoji', () => (
    <button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </button>
  ));
