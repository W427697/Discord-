import '@storybook/renderer-react/dist/client/globals';
import { window } from 'global';

if (window) {
  window.STORYBOOK_ENV = 'react';
}
