import React from 'react';
import { withTests } from '@storybook/addon-jest';
import { AccordionHeader } from '../AccordionHeader';
import results from '../../../../../.jest-test-results.json';

// eslint-disable-next-line import/order
import type { Story, Meta } from '@storybook/react';
import type { AccordionHeaderProps } from '../AccordionHeader';

export default {
  title: 'Basics/Accordion/AccordionHeader',
  component: AccordionHeader,
  argTypes: { onOpen: { action: 'open' }, onClose: { action: 'close' } },
  decorators: [withTests({ results })],
  parameters: {
    layout: 'padded',
  },
} as Meta;

const Template: Story<AccordionHeaderProps> = (args) => (
  <AccordionHeader {...args}>Item 1</AccordionHeader>
);

export const Controllable = Template.bind({});
Controllable.args = {
  open: false,
  hideIcon: false,
  preventToggle: false,
};
