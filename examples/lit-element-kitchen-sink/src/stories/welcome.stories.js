import '../components/storybook-welcome';
import Logo from '../components/logo.svg';

export default {
  title: 'Welcome',
};

export const Welcome = () => `<storybook-welcome logo=${Logo}></storybook-welcome>`;
