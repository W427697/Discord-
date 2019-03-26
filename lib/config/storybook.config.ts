import path from 'path';
import { create } from '@storybook/theming';

export const entries = /\..*story\..*/;
export const preview = {};
export const manager = {};
export const theme = create({ base: 'light', brandTitle: 'test' });

export const unused = (z: string) => path.join('base', z);

export type Foo = string | number;
