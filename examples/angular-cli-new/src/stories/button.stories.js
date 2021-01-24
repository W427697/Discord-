import { document } from 'global';
import { action } from '@storybook/addon-actions';
import { useEffect } from '@storybook/client-api';

export default {
  title: 'Demo',
};

export const Heading = () => ({ template: '<h1>Hello World</h1>' });
