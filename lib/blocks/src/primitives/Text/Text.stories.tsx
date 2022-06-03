import React from 'react';
import { Text } from '..';

export default {
  title: 'Primitives/Text',
  component: Text,
};

export const Simple = () => <Text>This is a sample text</Text>;

export const Paragraph = () => <Text as="p">This is a paragraph</Text>;

export const Variant = () => <Text variant="caption">This is a caption</Text>;

export const Custom = () => (
  <Text
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
