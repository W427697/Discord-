/// <reference types="webpack-env" />

// There can only be 1 default export per entry point and it has to be directly from index
// Exporting this twice in order to to be able to import it like { addons } instead of 'addons'
// prefer import { addons } from '@storybook/addons' over import addons from '@storybook/addons'
//
// See main.ts
// eslint-disable-next-line import/no-cycle
import { addons } from './main';

// eslint-disable-next-line import/no-cycle
export * from './make-decorator';
// eslint-disable-next-line import/no-cycle
export * from './main';
export * from './storybook-channel-mock';
// eslint-disable-next-line import/no-cycle
export * from './hooks';

export default addons;
