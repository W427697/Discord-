import { document } from 'global';
import renderStorybookUI from '@storybook/ui';
import Provider from './provider';
import { importPolyfills } from './conditional-polyfills';

importPolyfills().then(() => {
  const rootElement = document.getElementById('root');
  renderStorybookUI(rootElement, new Provider());
});
