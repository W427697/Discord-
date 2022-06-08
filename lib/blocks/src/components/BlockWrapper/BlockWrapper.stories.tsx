import React from 'react';
import { Stack, Text } from '../../primitives';
import { Title } from '../Title';
import { BlockWrapper } from './BlockWrapper';

export default {
  component: BlockWrapper,
};

export const Simple = () => (
  <BlockWrapper>
    <Stack css={{ padding: 'medium' }}>
      <Title>This is a block title</Title>
      <Text as="p">This is a content of the block</Text>
    </Stack>
  </BlockWrapper>
);
