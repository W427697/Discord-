/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@junk-temporary-prototypes/react';
import ComponentItem from './ComponentItem';

export function someHelper() {
  return 5;
}

storiesOf('ComponentItem', module)
  .addDecorator((storyFn) => <div style={{ margin: '1rem' }}>{storyFn()}</div>)
  .add('loading', () => <ComponentItem loading />);
