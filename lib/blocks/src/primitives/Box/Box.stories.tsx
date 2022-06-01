import React from 'react';
import { Box } from '../index';

export default {
  title: 'Primitives/Box',
  component: Box,
};

export const Simple = () => <Box>test</Box>;

export const Button = () => (
  <Box as="button" onClick={(event) => console.log(event)}>
    test
  </Box>
);

export const Atomic = () => (
  <Box
    css={{
      background: 'blue-50',
      color: 'gray-800',
      padding: 'large',
    }}
  >
    test
  </Box>
);

export const Dynamic = () => (
  <Box
    css={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'blue-50',
      width: { mobile: '100%', desktop: '50%' },
      height: { mobile: '100px', desktop: '200px' },
    }}
  >
    test
  </Box>
);

export const Custom = () => (
  <Box
    css={{
      opacity: 0.5,
    }}
  >
    test
  </Box>
);
