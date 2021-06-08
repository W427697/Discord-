import React from 'react';
import { ComponentStory, Meta } from '@storybook/react';
import { Tabs } from './tabs';
import { TabItem } from './TabItem';

export default {
  title: 'Basics/Accordion',
  component: Tabs,
  argTypes: { onOpen: { action: 'open' }, onClose: { action: 'close' } },
  parameters: {
    test: { disable: true },
    storysource: { disable: true },
  },
} as Meta;

const Template: ComponentStory<typeof Tabs> = (args) => (
  <Tabs>
    <TabItem>Hello</TabItem>
    <TabItem>Hello</TabItem>
  </Tabs>
);

export const Controllable = Template.bind({});
Controllable.args = {};
