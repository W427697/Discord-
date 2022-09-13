import { Meta, Story } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { SbButton } from './sb-button';

interface SbButtonSlots extends SbButton {
  prefix: string;
}

export default {
  title: 'Example/Button',
  // Need to set the tag to make addon-docs works properly with CustomElementsManifest
  component: 'sb-button',
  argTypes: {
    onClick: { action: 'onClick' },
  },
  parameters: {
    actions: {
      handles: ['click', 'sb-button:click'],
    },
  },
} as Meta;

const Template: Story<SbButtonSlots> = ({ primary, backgroundColor, size, label, prefix }) =>
  html`<sb-button
    ?primary="${primary}"
    size="${ifDefined(size)}"
    label="${ifDefined(label)}"
    background-color="${ifDefined(backgroundColor)}"
    ><span slot="prefix">${prefix}</span></sb-button
  >`;

export const Primary: Story<SbButtonSlots> = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};

export const Secondary: Story<SbButtonSlots> = Template.bind({});
Secondary.args = {
  label: 'Button',
};

export const Large: Story<SbButtonSlots> = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Button',
};

export const Small: Story<SbButtonSlots> = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Button',
};
