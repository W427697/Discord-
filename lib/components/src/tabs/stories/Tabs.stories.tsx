import React from 'react';
import { ComponentStory, Meta } from '@storybook/react';
import { styled } from '@storybook/theming';
import { Tabs } from '../tabs';
import { TabsItem } from '../TabsItem';

export default {
  title: 'Basics/TabsBar',
  component: Tabs,
  argTypes: {
    onSelect: { action: 'onSelect', table: { disable: true } },
    onChange: { action: 'onChange', table: { disable: true } },
    backgroundColor: { control: { type: 'color' } },
    initial: {
      options: [undefined, 'test1', 'test2', 'test3', 'test4', 0, 1, 2, 3],
      control: { type: 'select' },
    },
    selected: {
      options: [undefined, 'test1', 'test2', 'test3', 'test4', 0, 1, 2, 3],
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

const Template: ComponentStory<typeof Tabs> = (args) => (
  <Tabs {...args}>
    <TabsItem id="test1" title="Content 1">
      <Content>Content Tab 1</Content>
    </TabsItem>
    <TabsItem id="test2" title="Content 2">
      {({ previous }) => (
        <Content>
          <h2 style={{ marginBottom: 12 }}>Content Tab 2</h2>
          <div style={{ fontSize: 14 }}>
            <div>Previous tab Title: {previous.title}</div>
            <div>Previous tab ID: {previous.id}</div>
            <div>Previous tab Index: {previous.index}</div>
          </div>
        </Content>
      )}
    </TabsItem>
    <TabsItem id="test3" title="With Icon" icon="globe">
      <Content>Content Tab 3</Content>
    </TabsItem>
    <TabsItem id="test4" icon="globe">
      <Content>Content Tab 4</Content>
    </TabsItem>
    <TabsItem id="test5" title="🇺🇸">
      <Content>Content Tab 5</Content>
    </TabsItem>
    <TabsItem id="test6" title="Button Type" type="button" />
    <TabsItem id="test7" title="Menu Type" type="menu">
      <div>hello 1</div>
      <div>hello 2</div>
      <div>hello 3</div>
      <div>hello 4</div>
    </TabsItem>
  </Tabs>
);

export const Controllable = Template.bind({});
Controllable.args = {
  bordered: true,
  rounded: false,
  backgroundColor: '',
  initial: 'test2',
  selected: '',
};
