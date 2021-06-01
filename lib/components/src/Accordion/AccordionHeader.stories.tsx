import React from 'react';
import { AccordionHeader as AccordionHeaderProxy } from './AccordionHeader';

// eslint-disable-next-line import/order
import type { Story, Meta } from '@storybook/react';
import type { AccordionHeaderProps } from './AccordionHeader';

export default {
  title: 'Basics/Accordion/Components',
  component: AccordionHeaderProxy,
  parameters: {
    layout: 'padded',
  },
} as Meta;

const Template: Story<AccordionHeaderProps> = (args) => {
  return <AccordionHeaderProxy {...args}>Item 1</AccordionHeaderProxy>;
};

export const AccordionHeader = Template.bind({});
AccordionHeader.args = {
  open: false,
};
