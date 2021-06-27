import { AugmentedWindow } from '@storybook/core-client';
import _root from 'window-or-global';

const root = _root as AugmentedWindow;

root.STORYBOOK_ENV = 'html';
