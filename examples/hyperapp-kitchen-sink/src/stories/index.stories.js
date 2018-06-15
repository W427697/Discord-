import { storiesOf } from '@storybook/hyperapp';
import { action } from '@storybook/addon-actions';
import { withLinks } from '@storybook/addon-links';
import { h } from 'hyperapp';
import Welcome from '../components/Welcome';
import Button from '../components/Button';

storiesOf('Welcome', module)
  .addDecorator(withLinks)
  .add('welcome', () => <Welcome />);

storiesOf('Demo', module).add('button', () => (
  <Button onclick={() => action('button-click')}>Click me</Button>
));
