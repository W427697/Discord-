import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Button from './Button';
import Welcome from './Welcome';

storiesOf('Welcome')
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')}/>
  ));

storiesOf('Button')
  .add('with text', () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
  ));

storiesOf('Advanced')
    .add('no metadata', {
      story: () => (
          <Button onClick={action('clicked')}>Hello Button</Button>
      )
    })
    .add('with metadata', {
      story: () => (
          <Button onClick={action('clicked')}>Hello Button</Button>
      ),
      someProperty: 0
    });

storiesOf({ name: 'Metameta', storyMetadata: 'something something' })
    .add('normal', () => (<p>Nothing here</p>));