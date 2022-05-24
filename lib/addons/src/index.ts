// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./typings.d.ts" />
/// <reference types="webpack-env" />

// There can only be 1 default export per entry point and it has to be directly from public_api
// Exporting this twice in order to to be able to import it like { addons } instead of 'addons'
// prefer import { addons } from '@storybook/addons' over import addons from '@storybook/addons'
//
// See addons.ts
import { addons } from './addons';

export * from './make-decorator';
export * from './addons';
export * from './types';
export * from './storybook-channel-mock';
export * from './hooks';

export default addons;
