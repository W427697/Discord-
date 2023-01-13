import { global as globalThis } from '@storybook/global';

const MyButton = globalThis.Components.Button;

export default {
  component: MyButton,
  parameters: {
    controls: {
      expanded: true,
    },
  },
};

export const WithDefaultRenderAndDefaultSlot = {
  args: {
    default: 'Button with default render and default slot',
  },
};

export const WithDefaultRenderAndNamedSlot = {
  args: {
    default: 'Button with default render and named slot',
    icon: '<svg width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="m9 18 6-6-6-6"/></svg>',
  },
};
