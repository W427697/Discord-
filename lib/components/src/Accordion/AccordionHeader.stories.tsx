import React from 'react';
import type { Story as StoryType, Meta } from '@storybook/react';
import { AccordionHeader as AccordionHeaderProxy } from './AccordionHeader';

import type { AccordionHeaderProps } from './AccordionHeader';

export default {
  title: 'Basics/Accordion/Components',
  component: AccordionHeaderProxy,
} as Meta;

const Template: StoryType<AccordionHeaderProps> = (args) => {
  return <AccordionHeaderProxy {...args}>Item 1</AccordionHeaderProxy>;
};

export const AccordionHeader = Template.bind({});
AccordionHeader.args = {
  open: false,
};
