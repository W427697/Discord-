import React from 'react';
import { Box } from '.';

export default {
  title: 'Primitives/Box',
  component: Box,
};

export const Simple = () => <Box>test</Box>;

export const Props = () => (
  <Box backgroundColor="black50" color="black10">
    test
  </Box>
);
