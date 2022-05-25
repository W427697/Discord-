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

export const Props = () => (
  <Box background="blue-50" color="gray-800" padding="large" width="200px" height="200px">
    test
  </Box>
);
