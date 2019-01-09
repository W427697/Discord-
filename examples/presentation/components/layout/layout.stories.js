import React from 'react';
import { storiesOf } from '@storybook/react';
import styled from '@emotion/styled';

import { withKnobs, text } from '@storybook/addon-knobs';

import SideBySide from './side-by-side';
import WrappingInline from './wrapping-inline';
import Placeholder from './placeholder';

const Holder = styled.div({
  margin: 10,
  border: '1px dashed deepskyblue',
});

storiesOf('Core|Layout', module)
  .addParameters({
    notes: { markdown: require('./readme.md') },
  })
  .addDecorator(withKnobs)
  .add('side by side', () => (
    <Holder>
      <SideBySide>
        <Placeholder color="hotpink">{text('content 1', 'Content 1')}</Placeholder>
        <Placeholder color="deepskyblue">{text('content 2', 'Content 2')}</Placeholder>
      </SideBySide>
    </Holder>
  ))
  .add('wrapping line', () => (
    <Holder>
      <WrappingInline>
        <Placeholder inline color="hotpink">
          content 1
        </Placeholder>
        <Placeholder inline color="deepskyblue">
          content 2
        </Placeholder>
        <Placeholder inline color="orangered">
          content 3
        </Placeholder>
        <Placeholder inline color="deeppink">
          content 4
        </Placeholder>
      </WrappingInline>
    </Holder>
  ))
  .add('wrapping line aligned', () => (
    <Holder>
      <WrappingInline align="center">
        <Placeholder inline color="hotpink">
          content 1
        </Placeholder>
        <Placeholder inline color="deepskyblue">
          content 2
        </Placeholder>
        <Placeholder inline color="orangered">
          content 3
        </Placeholder>
        <Placeholder inline color="deeppink">
          content 4
        </Placeholder>
      </WrappingInline>
    </Holder>
  ));
