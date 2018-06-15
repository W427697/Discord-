import { storiesOf } from '@storybook/hyperapp';
import { h } from 'hyperapp';
import Welcome from './Welcome';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome />);
