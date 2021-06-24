import React from 'react';
import { ComponentStory, Meta } from '@storybook/react';
import { styled } from '@storybook/theming';
import { TabsBar } from '../TabsBar';
import { TabItem } from '../TabItem';

export default {
  title: 'Basics/TabsBar',
  component: TabsBar,
  argTypes: {
    onSelect: { action: 'onSelect', table: { disable: true } },
    onChange: { action: 'onChange', table: { disable: true } },
    backgroundColor: { control: { type: 'color' } },
    initial: {
      options: ['test1', 'test2', 'test3', 'test4', 0, 1, 2, 3],
      control: { type: 'select' },
    },
    selected: {
      options: ['test1', 'test2', 'test3', 'test4', 0, 1, 2, 3],
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
  <TabsBar {...args}>
    <TabItem id="test1" title="Content 1">
      <Content>
        <Title>Content Tab 1</Title>
      </Content>
    </TabItem>
    <TabItem id="test2" title="Content 2">
      {({ previous }) => (
        <Content>
          <Title>Content Tab 2</Title>
          <Text>
            <div>Previous tab Title: {previous.title}</div>
            <div>Previous tab ID: {previous.id}</div>
            <div>Previous tab Index: {previous.index}</div>
          </Text>
        </Content>
      )}
    </TabItem>
    <TabItem id="test3" title="With Icon" icon="globe">
      <Content>
        <Title>Content Tab 3</Title>
      </Content>
    </TabItem>
    <TabItem id="test4" icon="globe">
      <Content>
        <Title>Content Tab 4</Title>
        <Text>With icon "globe" and no title</Text>
      </Content>
    </TabItem>
    <TabItem id="test5" title="🇺🇸">
      <Content>
        <Title>Content Tab 5</Title>
        <Text>With a flag as a title</Text>
      </Content>
    </TabItem>
    <TabItem id="test6" title="Button Type" type="button" />
    <TabItem id="test7" icon="globe" type="button" narrow />
    <TabItem id="test8" icon="accessibility" type="button" narrow />
    <TabItem
      id="test9"
      title="Menu Type"
      type="menu"
      menu={[
        { id: 'menu-1', label: 'first item', icon: 'globe' },
        { id: 'menu-2', label: 'second item', icon: 'accessibility', left: '🇺🇸' },
        { id: 'menu-3', label: 'third item', icon: 'accessibility', left: '🇺🇸', right: 'right' },
        { id: 'menu-4', icon: 'accessibility', left: '🇺🇸' },
        { id: 'menu-5', icon: 'accessibility', right: 'right' },
        { id: 'menu-6', icon: 'accessibility', left: '🇺🇸', right: 'right' },
        { id: 'menu-7', icon: 'accessibility', left: '🇺🇸', right: 'right', center: 'center' },
        {
          id: 'menu-8',
          icon: 'accessibility',
          label: 'label here',
          left: '🇺🇸',
          right: 'right',
          center: 'center',
        },
      ]}
    />
    <TabItem
      id="test10"
      type="menu"
      icon="accessibility"
      menu={[
        { id: 'menu-11', label: 'Global Entry', icon: 'globe', right: 'alpha' },
        { id: 'menu-12', label: 'Action Bind', icon: 'accessibility', right: 'beta' },
        { id: 'menu-13', label: 'Data Bind', icon: 'basket', right: 'beta' },
        { id: 'menu-14', label: 'Check Apply', icon: 'calendar' },
        {
          id: 'menu-18',
          label: 'Murica!',
          left: '🇺🇸',
          center: 'center',
        },
      ]}
    />
    <TabItem id="test11" title="Button Type" type="button" />
    <TabItem id="test12" title="Button Type" type="button" />
    <TabItem id="test13" title="Button Type" type="button" />
    <TabItem id="test14" title="Button Type" type="button" />
    <TabItem id="test15" title="Button Type" type="button" />
  </TabsBar>
);

export const Controllable = Template.bind({});
Controllable.args = {
  bordered: true,
  rounded: false,
  backgroundColor: '',
  initial: 'test2',
  selected: '',
};
