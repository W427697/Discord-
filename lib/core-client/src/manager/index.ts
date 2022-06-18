import global from 'global';
import { renderStorybookUI } from '@storybook/ui';

import Provider from './provider';

const { document } = global;

const rootEl = document.getElementById('root');
renderStorybookUI(rootEl, new Provider());
