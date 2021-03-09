import { buildStatic } from '@storybook/core/server';
import { runNgcc } from './ngcc-execution';
import options from './options';

runNgcc();
buildStatic(options);
