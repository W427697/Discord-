import React from 'react';
import { storiesOf } from '@storybook/html';
import centered from '@storybook/addon-centered/react';

import BaseButton from './components/BaseButton';

storiesOf('React|Centered', module)
  .addParameters({ framework: 'react' })
  .addDecorator(centered)
  .add('story 1', () => <BaseButton label="This story should be centered" />);
