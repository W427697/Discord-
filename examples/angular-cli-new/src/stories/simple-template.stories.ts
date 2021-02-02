import { Story, Meta } from '@storybook/angular';
import { AppComponent } from '../app/app.component';

export default {
  title: 'Simple/Template',
} as Meta;

export const Base: Story = (_args, { parameters: { fileName, ...parameters } }) => ({
  component: AppComponent,
});
