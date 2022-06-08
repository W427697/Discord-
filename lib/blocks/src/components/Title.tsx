import React from 'react';
import { Text } from '../primitives';

export const Title: React.FC = (props) => {
  return (
    <Text
      as="h1"
      css={{
        color: 'text',
        fontSize: ['m3', 'l1'],
        fontWeight: 'black',
      }}
      {...props}
    />
  );
};
