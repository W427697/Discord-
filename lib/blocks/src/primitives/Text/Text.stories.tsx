import React from 'react';
import { Stack, Text } from '..';
import { sizes, TextVariants, tones } from './Text.css';

export default {
  component: Text,
};

export const Simple = {
  args: {
    children: 'Sample text',
  },
};

export const Sizes = () => {
  return (
    <Stack gap="small">
      {Object.keys(sizes).map((size: TextVariants['size']) => (
        <Text size={size} key={size}>
          Text of variant{' '}
          <Text as="em" tone="emphasis">
            {size}
          </Text>
        </Text>
      ))}
    </Stack>
  );
};

export const Tones = () => {
  return (
    <Stack gap="small">
      {Object.keys(tones).map((tone: TextVariants['tone']) => (
        <Text tone={tone} key={tone}>
          Text of variant{' '}
          <Text as="em" tone="emphasis">
            {tone}
          </Text>
        </Text>
      ))}
    </Stack>
  );
};

export const Custom = () => (
  <Text
    as="p"
    css={{
      fontSize: 's1',
      fontWeight: 'bold',
      color: 'background',
      background: 'text',
    }}
  >
    This is a paragraph
  </Text>
);
