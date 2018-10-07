import { NgStory } from '@storybook/angular';
import { Button } from '@storybook/angular/demo';

@NgStory({
  kind: 'Emoji with decorator',
  name: 'with some emoji',
  parameters: {
    moduleMetadata: {
      declarations: [Button],
    },
    template: `<storybook-button-component [text]="text" (onClick)="onClick($event)"></storybook-button-component>`,
    props: {
      text: '😀 😎 👍 💯',
      onClick: () => {},
    },
  },
})
export class WithSomeEmojiStory {}
