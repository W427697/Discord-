import _root from 'window-or-global';
import { AugmentedGlobal } from '@storybook/core-client';

const root = _root as AugmentedGlobal;

root.STORYBOOK_REACT_CLASSES = {};
root.STORYBOOK_ENV = 'vue';
