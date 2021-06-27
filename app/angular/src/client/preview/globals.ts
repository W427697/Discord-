import _root from 'window-or-global';
import { AugmentedGlobal } from '@storybook/core-client';
import './angular-polyfills';

const root = _root as AugmentedGlobal;

root.STORYBOOK_ENV = 'angular';
