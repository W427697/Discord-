import { AugmentedGlobal } from '@storybook/core-client';
import _root from 'window-or-global';

const root = _root as AugmentedGlobal;

root.STORYBOOK_ENV = 'preact';
