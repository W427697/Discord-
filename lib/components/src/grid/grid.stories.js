import React from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'react-emotion';

import { Spaced } from './grid';

const PlaceholderBlock = styled('div')(({ color }) => ({
  background: color || 'hotpink',
  padding: 20,
}));
const PlaceholderInline = styled('span')(({ color }) => ({
  background: color || 'hotpink',
  display: 'inline-block',
  padding: 20,
}));

storiesOf('Components|Grid', module)
  .add('row', () => (
    <div>
      <PlaceholderBlock color="green" />
      <Spaced row={1}>
        <PlaceholderBlock />
        <PlaceholderBlock />
        <PlaceholderBlock />
      </Spaced>
      <PlaceholderBlock color="green" />
    </div>
  ))
  .add('row outer', () => (
    <div>
      <PlaceholderBlock color="green" />
      <Spaced row={1} outer>
        <PlaceholderBlock />
        <PlaceholderBlock />
        <PlaceholderBlock />
      </Spaced>
      <PlaceholderBlock color="green" />
    </div>
  ))
  .add('col', () => (
    <div>
      <PlaceholderInline color="green" />
      <Spaced col={1}>
        <PlaceholderInline />
        <PlaceholderInline />
        <PlaceholderInline />
      </Spaced>
      <PlaceholderInline color="green" />
    </div>
  ))
  .add('col outer', () => (
    <div>
      <PlaceholderInline color="green" />
      <Spaced col={1} outer>
        <PlaceholderInline />
        <PlaceholderInline />
        <PlaceholderInline />
      </Spaced>
      <PlaceholderInline color="green" />
    </div>
  ));
