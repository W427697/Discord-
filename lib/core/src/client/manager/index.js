import { document } from 'global';
import renderStorybookUI from '@storybook/ui';
import { importPolyfills } from './conditional-polyfills';

importPolyfills().then(() => {
  const rootEl = document.getElementById('root');
  renderStorybookUI(rootEl);
});
