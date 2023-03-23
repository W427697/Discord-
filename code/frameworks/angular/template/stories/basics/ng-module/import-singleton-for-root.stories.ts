import { StoryFn, Meta, moduleMetadata } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';
import { ChipsModule } from './angular-src/chips.module';
import { ChipsGroupComponent } from './angular-src/chips-group.component';
import { SingletonService } from './angular-src/singleton.service';

export default {
  // title: 'Basics / NgModule / forRoot() pattern',
  component: ChipsGroupComponent,
  decorators: [
    moduleMetadata({
      imports: [ChipsModule],
    }),
  ],
  args: {
    chips: [
      {
        id: 1,
        text: 'Chip 1',
      },
      {
        id: 2,
        text: 'Chip 2',
      },
    ],
  },
  argTypes: {
    removeChipClick: { action: 'Remove chip' },
    removeAllChipsClick: { action: 'Remove all chips clicked' },
  },
} as Meta;

const Template = (): StoryFn => (args) => ({
  props: args,
});

export const SingletonsPattern = Template();
SingletonsPattern.decorators = [
  moduleMetadata({
    singletons: [importProvidersFrom(SingletonService.forRoot())],
  }),
];

export const ImportsPattern = Template();
ImportsPattern.decorators = [
  moduleMetadata({
    imports: [SingletonService.forRoot()],
  }),
];
