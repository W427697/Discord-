import React from 'react';
import { Stack, Text } from '../../primitives';
import { Title } from '../Title';
import { Block } from './Block';

export default {
  component: Block,
};

export const Simple = () => (
  <Block>
    <Stack css={{ padding: 'medium' }}>
      <Title>This is a block title</Title>
      <Text as="p">This is a content of the block</Text>
    </Stack>
  </Block>
);

export const Empty = () => <Block appearance="empty">This is an empty block</Block>;
