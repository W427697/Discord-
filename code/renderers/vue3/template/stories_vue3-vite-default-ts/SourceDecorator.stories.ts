import { global as globalThis } from '@storybook/global';
import { within } from '@storybook/testing-library';
import { STORY_ARGS_UPDATED, RESET_STORY_ARGS, UPDATE_STORY_ARGS } from '@storybook/core-events';

import type { Meta, StoryObj } from '@storybook/vue3';

import { SNIPPET_RENDERED } from '@storybook/docs-tools';
import GlobalUsage from './GlobalUsage.vue';
import GlobalSetup from './GlobalSetup.vue';

const meta: Meta = {
  component: GlobalUsage,
  argTypes: {},
  tags: ['autodocs'],
} satisfies Meta<typeof GlobalUsage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MultiComponents: Story = {
  args: {
    label: 'Button',
    size: 'large',
    backgroundColor: '#aa00ff',
    btn1Args: { label: 'Button 10', size: 'small', backgroundColor: '#aa00ff' },
  },
  render(args: any) {
    return {
      components: { GlobalUsage, GlobalSetup },
      setup() {
        return { args };
      },
      template: `<div style="background-color:pink;opacity:0.9;padding:20px" >
                  
                  <div style="display:flex;gap:10px">
                    <img src="https://user-images.githubusercontent.com/263385/199832481-bbbf5961-6a26-481d-8224-51258cce9b33.png" width="200" />  
                    <GlobalUsage v-bind="args.btn1Args" />&nbsp;
                  </div>
                  <h2>Complex Story Custom template </h2> <br/> <hr/>
                
                <GlobalSetup  :label="args.label" />
                <div style="margin:8px"><span style="font-size:28px;color:green">Multiple </span>
                <span style="background-color:magenta;opacity:0.9;padding:8px"><i>Components</i></span></div>
                <div style="display:flex;gap:10px">
                  <GlobalUsage v-bind="args" />
                  <GlobalUsage label="Static Label Dynamic color" :background-color="args.backgroundColor"/>  
                </div>   
               </div>`,
    };
  },
  play: async ({ canvasElement, id }) => {
    const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
    const canvas = within(canvasElement);

    await channel.emit(RESET_STORY_ARGS, { storyId: id });
    await new Promise((resolve) => {
      channel.once(STORY_ARGS_UPDATED, resolve);
    });

    channel.on(SNIPPET_RENDERED, (snippet: any) => {
      console.log('SNIPPET_RENDERED', snippet);
    }); // snippet is the rendered code snippet

    await channel.emit(UPDATE_STORY_ARGS, {
      storyId: id,
      updatedArgs: {
        label: 'Button 1',
        size: 'small',
        backgroundColor: '#aa00ff',
      },
    });
    await new Promise((resolve) => {
      channel.once(STORY_ARGS_UPDATED, resolve);
    });
  },
};
