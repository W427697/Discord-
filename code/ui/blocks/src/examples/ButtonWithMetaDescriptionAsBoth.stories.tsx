import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

/**
 * These are the stories for the Button component
 * __this description was written as a comment above the default export__
 * __this should never be shown in Storybook, as it will be overridden by parameters.docs.description.component__
 */
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
   `,
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithMetaDescriptionAsBoth: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};
