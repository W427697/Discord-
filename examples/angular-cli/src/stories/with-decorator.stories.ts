import { NgStory, NgStoryModule, ngBootstrapStoryModule } from '@storybook/angular';
import { Welcome, Button } from '@storybook/angular/demo';
import { linkTo } from '@storybook/addon-links';
import { centered } from '@storybook/addon-centered/angular';

@NgStory({
  kind: 'Story with decorator',
  name: 'to Storybook',
  parameters: {
    template: `<storybook-welcome-component (showApp)="showApp()"></storybook-welcome-component>`,
    props: {
      showApp: linkTo('Button'),
    },
    moduleMetadata: {
      declarations: [Welcome],
    },
  },
})
export class Storybook {}

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
export class WithText {}

@NgStory({
  kind: 'Story with decorator',
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
export class WithSomeEmoji {}

@NgStoryModule({
  name: 'Decorator',
  stories: [Storybook, WithText, WithSomeEmoji],
})
export class StoryModule {}

ngBootstrapStoryModule(StoryModule);
