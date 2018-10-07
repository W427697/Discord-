import { NgStory } from '@storybook/angular';
import { Button } from '@storybook/angular/demo';
import { centered } from '@storybook/addon-centered/angular';

@NgStory({
  kind: 'Story with decorator',
  name: 'with text',
  parameters: {
    moduleMetadata: {
      declarations: [Button],
    },
    template: `<storybook-button-component [text]="text" (onClick)="onClick($event)"></storybook-button-component>`,
    props: {
      text: 'Hello Button',
      onClick: (event: Event) => {
        console.log('some bindings work');
        console.log(event);
      },
    },
    addons: [centered],
  },
})
export class WithTextStory {}
