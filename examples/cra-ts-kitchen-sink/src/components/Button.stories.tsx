import * as React from 'react';
import { action } from '@storybook/addon-actions';
import Button from './Button';

export const simpleButton = () => <Button onClick={action('button clicked')}>OK</Button>;

simpleButton.story = {
  name: 'simple button',
};

export default {
  title: 'Button',
  component: Button,
};
