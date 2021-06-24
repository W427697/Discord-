import React from 'react';
import { ComponentStory, Meta } from '@storybook/react';
import { styled } from '@storybook/theming';
import { TabsBar } from '../TabsBar';

export default {
  title: 'Basics/TabsBarA',
  component: TabsBar,
  argTypes: {
    onSelect: { action: 'onSelect', table: { disable: true } },
    onChange: { action: 'onChange', table: { disable: true } },
    backgroundColor: { control: { type: 'color' } },
    initial: {
      options: ['a', 'b', 'c'],
      control: { type: 'select' },
    },
    selected: {
      options: ['a', 'b', 'c'],
      control: { type: 'select' },
    },
  },
  parameters: {
    test: { disable: true },
    storysource: { disable: true },
  },
} as Meta;

const Content = styled.div({
  padding: 20,
  fontSize: 18,
  fontWeight: 500,
});

const Title = styled.h2({
  marginBottom: 12,
});

const Text = styled.div({
  fontSize: 13,
});

const Template: ComponentStory<typeof TabsBar> = (args) => (
  <TabsBar
    {...args}
    tabs={[
      { id: 'a', label: 'a', content: 'hello from A', icon: 'globe' },
      { id: 'b', label: 'b', content: 'hello from B' },
      { id: 'c', content: 'hello from C', icon: 'globe' },
    ]}
  />
);

export const Controllable = Template.bind({});
Controllable.args = {
  bordered: true,
  rounded: false,
  backgroundColor: '',
  initial: 'a',
  selected: '',
};
