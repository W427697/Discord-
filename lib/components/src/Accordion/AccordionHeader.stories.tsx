import React from 'react';
import { AccordionHeader } from './AccordionHeader';

// eslint-disable-next-line import/order
import type { Story, Meta } from '@storybook/react';
import type { AccordionHeaderProps } from './AccordionHeader';

export default {
  title: 'Basics/Accordion/Components',
  component: AccordionHeader,
  parameters: {
    layout: 'padded',
  },
} as Meta;

const Template: Story<AccordionHeaderProps> = (args) => (
  <AccordionHeader {...args}>Item 1</AccordionHeader>
);

export const Header = Template.bind({});
Header.args = {
  open: false,
};
