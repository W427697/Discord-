/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { WithNotes } from '@storybook/addon-notes';

import Button from './Button';
import Welcome from './Welcome';
import ComponentWithRef from './ComponentWithRef';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .add('with text', () =>
    <WithNotes notes={'A very simple button'}>
      <Button onClick={action('clicked')}>Hello Button</Button>
    </WithNotes>
  )
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>);

storiesOf('ComponentWithRef', module).add('basic', () => <ComponentWithRef />);
