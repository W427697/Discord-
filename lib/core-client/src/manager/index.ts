import renderStorybookUI from '@storybook/ui';
import { document } from 'window-or-global';
import Provider from './provider';
import { importPolyfills } from './conditional-polyfills';

importPolyfills().then(() => {
  const rootEl = document.getElementById('root');
  renderStorybookUI(rootEl, new Provider());
});
