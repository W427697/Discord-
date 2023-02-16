import { Component } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';

@Component({
  selector: 'app-test',
  template: `hello`,
})
class TestComponent {}

export default {
  component: TestComponent,
  decorators: [
    moduleMetadata({
      imports: [NgxsModule.forRoot([])],
    }),
  ],
} as Meta;

const Template: StoryFn<TestComponent> = (args: TestComponent) => ({
  props: args,
});

export const Ngxs = Template.bind({});
