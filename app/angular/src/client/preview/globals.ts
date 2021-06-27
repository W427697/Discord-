import _root from 'window-or-global';
import { AugmentedWindow } from '@storybook/core-client';
import './angular-polyfills';

const root = _root as AugmentedWindow;

root.STORYBOOK_ENV = 'angular';
