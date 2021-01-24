import { Story, Meta } from '@storybook/angular-new';

export default {
  title: 'Simple/Template',
} as Meta;

export const Base: Story = (_args, { parameters: { fileName, ...parameters } }) => ({
  template: 'Button',
  props: {
    text: `Parameters are ${JSON.stringify(parameters, null, 2)}`,
    onClick: () => 0,
  },
});
