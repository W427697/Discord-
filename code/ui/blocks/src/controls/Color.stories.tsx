import type { Meta } from '@storybook/react';
import React from 'react';
import { useArgs } from '@storybook/addons';
import { ColorControl } from './Color';

export default {
  title: 'Controls/Color',
  // not using component here because we want to define argTypes ourselves
  tags: ['docsPage'],
  argTypes: {
    value: {
      description: 'Currently picked color',
      control: {
        type: 'color',
      },
    },
    startOpen: {
      description:
        'Whether the color picker should be open by default. Requires remount to see effect.',
      defaultValue: false,

      control: {
        type: 'boolean',
      },
    },
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    const { value, onChange } = args;

    return (
      <>
        <ColorControl
          {...args}
          onChange={(newValue) => {
            updateArgs({ value: newValue });
            onChange?.(newValue);
          }}
          name="color"
        />
        <pre>{JSON.stringify(value) || 'undefined'}</pre>
      </>
    );
  },
} as Meta<typeof ColorControl>;

export const Basic = {
  args: {
    value: '#ff00ff',
  },
};

export const Undefined = {
  args: {
    value: undefined,
  },
};

export const WithPresetColors = {
  args: {
    value: '#00ffff',
    presetColors: [
      { color: '#ff4785', title: 'Coral' },
      { color: '#1EA7FD', title: 'Ocean' },
      { color: 'rgb(252, 82, 31)', title: 'Orange' },
      { color: 'RGBA(255, 174, 0, 0.5)', title: 'Gold' },
      { color: 'hsl(101, 52%, 49%)', title: 'Green' },
      { color: 'HSLA(179,65%,53%,0.5)', title: 'Seafoam' },
      { color: '#6F2CAC', title: 'Purple' },
      { color: '#2A0481', title: 'Ultraviolet' },
      { color: 'black' },
      { color: '#333', title: 'Darkest' },
      { color: '#444', title: 'Darker' },
      { color: '#666', title: 'Dark' },
      { color: '#999', title: 'Mediumdark' },
      { color: '#ddd', title: 'Medium' },
      { color: '#EEE', title: 'Mediumlight' },
      { color: '#F3F3F3', title: 'Light' },
      { color: '#F8F8F8', title: 'Lighter' },
      { color: '#FFFFFF', title: 'Lightest' },
      '#fe4a49',
      '#FED766',
      'rgba(0, 159, 183, 1)',
      'HSLA(240,11%,91%,0.5)',
      'slategray',
    ],
  },
};

export const StartOpen = {
  args: {
    startOpen: true,
  },
};
