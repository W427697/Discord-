import React from 'react';
import { storiesOf } from '@storybook/react';

storiesOf('Core|Parameters/Decorator aguments', module)
  .addDecorator(fn => fn({ decoratorArgument: true }))
  .add('default', data => <pre>Parameters are {JSON.stringify(data, null, 2)}</pre>);
