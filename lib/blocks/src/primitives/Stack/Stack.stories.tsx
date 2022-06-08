import React from 'react';
import { Story } from '@storybook/react';
import { Box, orientationValues, Stack, StackProps } from '..';
import { vars } from '../theme.css';

export default {
  component: Stack,
  argTypes: {
    gap: {
      options: Object.keys(vars.space),
    },
    orientation: {
      options: Object.keys(orientationValues),
      control: 'radio',
    },
  },
};

const SampleBox: React.FC = ({ children }) => (
  <Box css={{ padding: 'medium', background: 'muted' }}>{children}</Box>
);

export const Sample: Story<StackProps> = (args) => (
  <Stack {...args}>
    <SampleBox>One</SampleBox>
    <SampleBox>Two</SampleBox>
    <SampleBox>Three</SampleBox>
  </Stack>
);

Sample.args = {
  gap: 'small',
};

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
