import { NgStory } from '@storybook/angular';
import { Welcome } from '@storybook/angular/demo';
import { linkTo } from '@storybook/addon-links';

@NgStory({
  kind: 'Welcome with decorator',
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
export class WelcomStory {}
