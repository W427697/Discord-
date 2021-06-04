import React from 'react';
import { AccordionBody } from '../AccordionBody';

// eslint-disable-next-line import/order
import type { Story, Meta } from '@storybook/react';
import type { AccordionBodyProps } from '../AccordionBody';

export default {
  title: 'Basics/Accordion/AccordionBody',
  component: AccordionBody,
  parameters: {
    layout: 'padded',
  },
} as Meta;

const Template: Story<AccordionBodyProps> = (args) => (
  <AccordionBody {...args}>
    Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse amet.
    Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat excepteur. Magna
    nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit ipsum.
  </AccordionBody>
);

export const Controllable = Template.bind({});
Controllable.args = {
  open: true,
};
