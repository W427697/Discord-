import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TabsState } from '@storybook/components/src/components/tabs/tabs';

export default {
  title: 'Tabs',
  args: {
    menuName: 'Addons',
  },
} satisfies Meta<typeof TabsState>;

type Story = StoryObj<typeof TabsState>;

export const RenderNoArgs = {
  render: (args) => (
    <TabsState {...args}>
      <div id="test1" title="With a function">
        {
          (({ active, selected }: { active: boolean; selected: string }) =>
            active ? <div>{selected} is selected</div> : null) as any
        }
      </div>
      <div id="test2" title="With markup">
        <div>test2 is always active (but visually hidden)</div>
      </div>
    </TabsState>
  ),
} satisfies Story;

export const RenderArgs = {
  args: {
    absolute: true,
  },
  render: (args) => (
    <TabsState {...args}>
      <div id="test1" title="With a function">
        {
          (({ active, selected }: { active: boolean; selected: string }) =>
            active ? <div>{selected} is selected</div> : null) as any
        }
      </div>
      <div id="test2" title="With markup">
        <div>test2 is always active (but visually hidden)</div>
      </div>
    </TabsState>
  ),
} satisfies Story;

export const RenderExistingArgs = {
  args: {
    absolute: true,
    bordered: true,
    initial: 'test2',
  },
  render: (args) => (
    <TabsState {...args}>
      <div id="test1" title="With a function">
        {
          (({ active, selected }: { active: boolean; selected: string }) =>
            active ? <div>{selected} is selected</div> : null) as any
        }
      </div>
      <div id="test2" title="With markup">
        <div>test2 is always active (but visually hidden)</div>
      </div>
    </TabsState>
  ),
} satisfies Story;
