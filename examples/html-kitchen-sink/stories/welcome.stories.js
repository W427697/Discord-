import { withLinks } from '@storybook/addon-links';

import './welcome.css';
import welcome from './welcome.html';
import welcomeAsync from './welcome.async.html';

export default {
  title: 'Welcome',
  decorators: [withLinks],
};

export const Welcome = () => welcome;
export const AsyncWelcome = async () => welcomeAsync;
