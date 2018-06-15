import { storiesOf } from '@storybook/hyperapp';
import { h } from 'hyperapp';
import Welcome from '../components/Welcome';

storiesOf('Welcome', module).add('welcome', () => <Welcome />);
