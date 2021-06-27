import _root from 'window-or-global';
import { AugmentedGlobal } from '@storybook/core-client';

const root = _root as AugmentedGlobal;

root.STORYBOOK_ENV = 'web-components';
