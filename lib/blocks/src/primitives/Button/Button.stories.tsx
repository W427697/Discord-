import React from 'react';
import { Button } from '..';

export default {
  component: Button,
};

export const Simple = () => <Button>Test</Button>;

export const CustomStyles = () => (
  <Button
    css={{
      color: 'background',
      background: 'text',
    }}
  >
    Test
  </Button>
);
