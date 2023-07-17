import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Select',
  component: Select,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Base: Story = {
  args: { placeholder: 'Select a fruit...' },
  render: (_, { args }) => (
    <Select {...args}>
      <Select.Item value="aubergine">Aubergine</Select.Item>
      <Select.Item value="broccoli">Broccoli</Select.Item>
      <Select.Item value="carrot">Carrot</Select.Item>
      <Select.Item value="courgette">Courgette</Select.Item>
      <Select.Item value="leek">Leek</Select.Item>
      <Select.Item value="aubergine">Aubergine</Select.Item>
      <Select.Item value="broccoli">Broccoli</Select.Item>
      <Select.Item value="carrot">Carrot</Select.Item>
      <Select.Item value="courgette">Courgette</Select.Item>
      <Select.Item value="leek">Leek</Select.Item>
      <Select.Item value="aubergine">Aubergine</Select.Item>
      <Select.Item value="broccoli">Broccoli</Select.Item>
      <Select.Item value="carrot">Carrot</Select.Item>
      <Select.Item value="courgette">Courgette</Select.Item>
      <Select.Item value="leek">Leek</Select.Item>
      <Select.Item value="aubergine">Aubergine</Select.Item>
      <Select.Item value="broccoli">Broccoli</Select.Item>
      <Select.Item value="carrot">Carrot</Select.Item>
      <Select.Item value="courgette">Courgette</Select.Item>
      <Select.Item value="leek">Leek</Select.Item>
      <Select.Item value="aubergine">Aubergine</Select.Item>
      <Select.Item value="broccoli">Broccoli</Select.Item>
      <Select.Item value="carrot">Carrot</Select.Item>
      <Select.Item value="courgette">Courgette</Select.Item>
      <Select.Item value="leek">Leek</Select.Item>
      <Select.Item value="aubergine">Aubergine</Select.Item>
      <Select.Item value="broccoli">Broccoli</Select.Item>
      <Select.Item value="carrot">Carrot</Select.Item>
      <Select.Item value="courgette">Courgette</Select.Item>
      <Select.Item value="leek">Leek</Select.Item>
      <Select.Item value="aubergine">Aubergine</Select.Item>
      <Select.Item value="broccoli">Broccoli</Select.Item>
      <Select.Item value="carrot">Carrot</Select.Item>
      <Select.Item value="courgette">Courgette</Select.Item>
      <Select.Item value="leek">Leek</Select.Item>
      <Select.Item value="aubergine">Aubergine</Select.Item>
      <Select.Item value="broccoli">Broccoli</Select.Item>
      <Select.Item value="carrot">Carrot</Select.Item>
      <Select.Item value="courgette">Courgette</Select.Item>
      <Select.Item value="leek">Leek</Select.Item>
      <Select.Item value="aubergine">Aubergine</Select.Item>
      <Select.Item value="broccoli">Broccoli</Select.Item>
      <Select.Item value="carrot">Carrot</Select.Item>
      <Select.Item value="courgette">Courgette</Select.Item>
      <Select.Item value="leek">Leek</Select.Item>
      <Select.Item value="aubergine">Aubergine</Select.Item>
      <Select.Item value="broccoli">Broccoli</Select.Item>
      <Select.Item value="carrot">Carrot</Select.Item>
      <Select.Item value="courgette">Courgette</Select.Item>
      <Select.Item value="leek">Leek</Select.Item>
      <Select.Item value="aubergine">Aubergine</Select.Item>
      <Select.Item value="broccoli">Broccoli</Select.Item>
      <Select.Item value="carrot">Carrot</Select.Item>
      <Select.Item value="courgette">Courgette</Select.Item>
      <Select.Item value="leek">Leek</Select.Item>
      <Select.Item value="aubergine">Aubergine</Select.Item>
      <Select.Item value="broccoli">Broccoli</Select.Item>
      <Select.Item value="carrot">Carrot</Select.Item>
      <Select.Item value="courgette">Courgette</Select.Item>
      <Select.Item value="leek">Leek</Select.Item>
      <Select.Item value="aubergine">Aubergine</Select.Item>
      <Select.Item value="broccoli">Broccoli</Select.Item>
      <Select.Item value="carrot">Carrot</Select.Item>
      <Select.Item value="courgette">Courgette</Select.Item>
      <Select.Item value="leek">Leek</Select.Item>
      <Select.Item value="aubergine">Aubergine</Select.Item>
      <Select.Item value="broccoli">Broccoli</Select.Item>
      <Select.Item value="carrot">Carrot</Select.Item>
      <Select.Item value="courgette">Courgette</Select.Item>
      <Select.Item value="leek">Leek</Select.Item>
    </Select>
  ),
};
