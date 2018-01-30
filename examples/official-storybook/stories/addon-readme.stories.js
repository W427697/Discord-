import React from 'react';
import { withReadMe } from '@storybook/addon-readme';
import { storiesOf } from '@storybook/react';
import BaseButton from '../components/BaseButton';
import readMe from './notes/readme.md';

storiesOf('Addons|ReadMe', module)
  .addDecorator(withReadMe(readMe))
  .add('with text', () => <BaseButton label="Button with readme" />);
