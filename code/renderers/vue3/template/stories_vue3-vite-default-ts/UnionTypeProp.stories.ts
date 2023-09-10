import type { Meta, StoryObj } from '@storybook/vue3';

import MyComponent from './UnionTypeProp.vue';

const meta: Meta = {
  component: MyComponent,
  argTypes: {},
  tags: ['autodocs'],
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UnionType: Story = {
  args: {
    label: 'UnionType',
    stringOrNumber: 12,
    booleanOrNumber: true,
    multiple: { a: 1, b: 2 },
  },
};
