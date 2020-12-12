import { buildStatic } from '@storybook/core/server';
import options from './options';

console.log(require('vue').version);

buildStatic(options);
