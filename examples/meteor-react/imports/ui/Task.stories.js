import React from 'react';
import { storiesOf } from '@storybook/react';

import Task from './Task';

storiesOf('Task')
  .addDecorator(story => <ul>{story()}</ul>)
  .add('default', () => <Task task={{ text: 'My Task' }} />);
