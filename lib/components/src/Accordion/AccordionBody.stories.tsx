import React from 'react';
import type { Story as StoryType, Meta } from '@storybook/react';
import { AccordionBody as AccordionBodyProxy } from './AccordionBody';

import type { AccordionBodyProps } from './AccordionBody';

export default {
  title: 'Basics/Accordion/Components',
  component: AccordionBodyProxy,
} as Meta;

const Template: StoryType<AccordionBodyProps> = (args) => {
  return (
    <AccordionBodyProxy {...args}>
      Minim proident eu aliqua irure tempor incididunt fugiat. Adipisicing aliquip cillum esse amet.
      Consequat qui consectetur duis laboris aliqua fugiat Lorem eiusmod ut cupidatat excepteur.
      Magna nulla nulla velit voluptate duis nulla quis Lorem dolore labore aliqua sit ipsum.
    </AccordionBodyProxy>
  );
};

export const AccordionBody = Template.bind({});
AccordionBody.args = {
  open: true,
};
