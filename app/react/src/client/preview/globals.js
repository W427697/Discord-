import '@storybook/addon-react/dist/client/globals';
import { window } from 'global';

if (window) {
  window.STORYBOOK_ENV = 'react';
}
