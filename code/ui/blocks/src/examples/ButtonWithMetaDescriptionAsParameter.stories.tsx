import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Blocks/Description/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  parameters: {
    docs: {
      description: {
        component: `
These are the stories for the Button component
__this description was written as a string in parameters.docs.description.component__
__and should override the comment above the default export__
   `,
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithMetaDescriptionAsParamater: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};
