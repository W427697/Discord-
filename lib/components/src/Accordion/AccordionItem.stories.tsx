import React from 'react';
import type { Story as StoryType, Meta } from '@storybook/react';
import { AccordionItem as AccordionItemProxy } from './AccordionItem';
import { AccordionHeader } from './AccordionHeader';
import { AccordionBody } from './AccordionBody';

import type { AccordionItemProps } from './AccordionItem';

export default {
  title: 'Basics/Accordion/Components',
  component: AccordionItemProxy,
} as Meta;

const Template: StoryType<AccordionItemProps> = (args) => {
  return (
    <AccordionItemProxy {...args}>
      <AccordionHeader>Item 1</AccordionHeader>
      <AccordionBody>
        Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse
        amet. Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat
        excepteur. Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit
        ipsum.
      </AccordionBody>
    </AccordionItemProxy>
  );
};

export const AccordionItem = Template.bind({});
AccordionItem.args = {
  open: false,
};
