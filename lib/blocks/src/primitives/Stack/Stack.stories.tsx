import React from 'react';
import { Box, Stack } from '..';

export default {
  title: 'Primitives/Stack',
  component: Stack,
  // argTypes: {
  //   gap: {
  //     description: 'test',
  //     // name: 'test',
  //   },
  // },
};

const SampleBox: React.FC = ({ children }) => (
  <Box css={{ padding: 'medium', background: 'muted' }}>{children}</Box>
);

export const Vertical = () => (
  <Stack gap="small">
    <SampleBox>One</SampleBox>
    <SampleBox>Two</SampleBox>
    <SampleBox>Three</SampleBox>
  </Stack>
);

export const Horizontal = () => (
  <Stack gap="small" orientation="horizontal">
    <SampleBox>One</SampleBox>
    <SampleBox>Two</SampleBox>
    <SampleBox>Three</SampleBox>
  </Stack>
);

export const Responsive = () => (
  <Stack
    gap={['small', 'medium', 'large']}
    orientation={{ mobile: 'vertical', desktop: 'horizontal' }}
  >
    <SampleBox>One</SampleBox>
    <SampleBox>Two</SampleBox>
    <SampleBox>Three</SampleBox>
  </Stack>
);
