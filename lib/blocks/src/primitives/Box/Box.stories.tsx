import React from 'react';
import { Box } from '..';

export default {
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
      background: 'text',
      color: 'background',
      padding: 'large',
    }}
  >
    test
  </Box>
);

export const Responsive = () => (
  <Box
    css={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'background',
      width: { mobile: '100%', desktop: '50%' },
      height: { mobile: '100px', tablet: '200px', desktop: '400px' },
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
