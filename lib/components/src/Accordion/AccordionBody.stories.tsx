import React from 'react';
import { AccordionBody as AccordionBodyProxy } from './AccordionBody';

// eslint-disable-next-line import/order
import type { Story, Meta } from '@storybook/react';
import type { AccordionBodyProps } from './AccordionBody';

export default {
  title: 'Basics/Accordion/Components',
  component: AccordionBodyProxy,
  parameters: {
    layout: 'padded',
  },
} as Meta;

const Template: Story<AccordionBodyProps> = (args) => {
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
