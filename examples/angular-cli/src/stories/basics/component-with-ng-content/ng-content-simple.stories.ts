import { Component, Input } from '@angular/core';

import { Meta, StoryObj } from '@storybook/angular/types-6-0';

@Component({
  selector: 'storybook-with-ng-content',
  template: `Content value:
    <div style="color: #1e88e5;" [ngStyle]="{ border: redBorder ? '1px solid red' : false }">
      <ng-content></ng-content>
    </div>`,
})
class WithNgContentComponent {
  @Input() redBorder = false;
}

export default {
  title: 'Basics / Component / With ng-content / Simple',
  component: WithNgContentComponent,
} as Meta;

export const OnlyComponent = {};

export const Default: StoryObj = {
  render: (args) => ({
    props: args,
    innerTemplate: `<h1>This is rendered in ng-content</h1>`,
  }),
};

export const WithGeneratedTemplateAndArgs: StoryObj = {
  args: { redBorder: true },
  render: (args) => ({
    props: args,
    innerTemplate: `<h1>This is rendered in ng-content</h1>`,
  }),
};

export const WithDynamicContentAndArgs: StoryObj = {
  args: { content: 'Default content' },
  argTypes: { content: { control: 'text' } },
  render: (args) => ({
    props: args,
    innerTemplate: `<h1>${args.content}</h1>`,
  }),
};
