import React from 'react';
import { AccordionItem } from '../AccordionItem';
import { AccordionHeader } from '../AccordionHeader';
import { AccordionBody } from '../AccordionBody';

// eslint-disable-next-line import/order
import type { Story, Meta } from '@storybook/react';
import type { AccordionItemProps } from '../AccordionItem';

export default {
  title: 'Basics/Accordion/AccordionItem',
  component: AccordionItem,
  parameters: {
    layout: 'padded',
  },
} as Meta;

const Template: Story<AccordionItemProps> = (args) => (
  <AccordionItem {...args}>
    <AccordionHeader>Item 1</AccordionHeader>
    <AccordionBody>
      Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse amet.
      Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat excepteur.
      Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit ipsum.
    </AccordionBody>
  </AccordionItem>
);

export const Controllable = Template.bind({});
Controllable.args = {
  open: false,
  narrow: false,
  indentBody: false,
  preventToggle: false,
};
