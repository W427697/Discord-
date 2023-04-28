/* eslint-disable */
import React from 'react';
import Button from './Button';

import { storiesOf } from '@junk-temporary-prototypes/react';

storiesOf('Button', module)
  .addParameters({ component: Button, foo: 1 })
  .addParameters({ bar: 2 })
  .add('with kind parameters', () => <Button label="The Button" />);
