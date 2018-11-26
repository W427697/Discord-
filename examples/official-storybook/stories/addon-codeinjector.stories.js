import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Addons|Codeinjector', module).add('Simple Button', () => (
  <button
    type="button"
    style={{ fontSize: '1.1em', textAlign: 'left' }}
    className="btn btn-lg btn-primary"
  >
    Use the code injector to:-
    <br />
    1. Add bootstrap css library
    <br />
    2. Add jquery and use it to add a click handler
  </button>
));
