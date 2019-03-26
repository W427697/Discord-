import path from 'path';
import { create } from '@storybook/theming';

export const entries = /\..*story\..*/;
export const preview = {};
export const manager = {};
export const theme = create({ brandTitle: 'test' });

export const presets = [];
export const addons = [''];

export const previewInit = '.storybook/config.js';
export const managerInit = '.storybook/addons.js';

export const unused = z => path.join('base', z);
