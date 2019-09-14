import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from './Button';

export default { title: 'Button', component: Button };

const props = { onClick: action('click', { depth: 1 }) };

export const normal = () => <Button {...props} label="button" />;

export const link = () => <Button {...props} isLink label="link" />;

export const loading = () => <Button {...props} isLoading />;
