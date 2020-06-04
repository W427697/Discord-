import { addDecorator } from '@storybook/client-api';
import { withStartup } from './makeDecorator';

export const initStartup = () => {
  console.log('initializing');
  addDecorator(withStartup);
};
