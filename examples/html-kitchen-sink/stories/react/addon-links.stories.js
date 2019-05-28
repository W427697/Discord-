import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/html';
import { linkTo, hrefTo } from '@storybook/addon-links';
import { action } from '@storybook/addon-actions';

import LinkTo from '@storybook/addon-links/react';

storiesOf('React|Links.Link', module)
  .addParameters({ framework: 'react' })
  .add('First', () => <LinkTo story="Second">Go to Second</LinkTo>)
  .add('Second', () => <LinkTo story="First">Go to First</LinkTo>);

storiesOf('React|Links.Button', module)
  .addParameters({ framework: 'react' })
  .add('First', () => (
    <button type="button" onClick={linkTo('React|Links.Button', 'Second')}>
      Go to "Second"
    </button>
  ))
  .add('Second', () => (
    <button type="button" onClick={linkTo('React|Links.Button', 'First')}>
      Go to "First"
    </button>
  ));

storiesOf('React|Links.Select', module)
  .addParameters({ framework: 'react' })
  .add('Index', () => (
    <select value="Index" onChange={linkTo('React|Links.Select', e => e.currentTarget.value)}>
      <option>Index</option>
      <option>First</option>
      <option>Second</option>
      <option>Third</option>
    </select>
  ))
  .add('First', () => <LinkTo story="Index">Go back</LinkTo>)
  .add('Second', () => <LinkTo story="Index">Go back</LinkTo>)
  .add('Third', () => <LinkTo story="Index">Go back</LinkTo>);

storiesOf('React|Links.Href', module).add(
  'log',
  () => {
    hrefTo('React|Links.Href', 'log').then(href => action('URL of this story')(href));

    return <span>See action logger</span>;
  },
  {
    framework: 'react',
    options: {
      panel: 'storybook/actions/panel',
    },
  }
);

storiesOf('React|Links.Scroll position', module)
  .addParameters({ framework: 'react' })
  .addDecorator(storyFn => (
    <Fragment>
      <div style={{ marginBottom: '100vh' }}>Scroll down to see the link</div>
      {storyFn()}
    </Fragment>
  ))
  .add('First', () => <LinkTo story="Second">Go to Second</LinkTo>)
  .add('Second', () => <LinkTo story="First">Go to First</LinkTo>);
