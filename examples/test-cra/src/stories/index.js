/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { WithNotes } from '@storybook/addon-notes';
import { withKnobs, text, number } from '@storybook/addon-knobs';
import centered from '@storybook/addon-centered';

import Button from './Button';
import Welcome from './Welcome';
import ComponentWithRef from './ComponentWithRef';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>)
  .add('with notes', () =>
    <WithNotes notes={'A very simple button'}>
      <Button>Check my notes in the notes panel</Button>
    </WithNotes>
  )
  .add('with knobs', () => {
    const label = text('Label', 'Edit me in knobs panel');
    const num = number('Number', 1);
    return <Button>{label} {num}</Button>;
  })
  .addWithInfo('with some info', 'Use the info addon with its painful API.', () =>
    <Button>click the "?" in top right for info</Button>
  )
  .addWithInfo(
    'with some info 2',
    'Use the info addon with its painful API.',
    () => <Button>click the "?" in top right for info</Button>,
    { inline: true, propTables: [Button] }
  );

storiesOf('Centered Button', module)
  .addDecorator(centered)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>);

storiesOf('ComponentWithRef', module).add('basic', () => <ComponentWithRef />);
