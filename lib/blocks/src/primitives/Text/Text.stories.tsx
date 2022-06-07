import React from 'react';
import { Stack, Text } from '..';
import { TextVariants, variants } from './Text.css';

export default {
  component: Text,
};

export const Simple = () => <Text>This is a sample text</Text>;

export const Variants = () => {
  return (
    <Stack gap="small">
      {Object.keys(variants).map((variant: TextVariants['variant']) => (
        <Text variant={variant} key={variant}>
          Text of variant{' '}
          <Text as="em" variant="emphasis">
            {variant}
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
      fontSize: 'large',
      fontWeight: 'bold',
      color: 'background',
      background: 'text',
    }}
  >
    This is a paragraph
  </Text>
);
