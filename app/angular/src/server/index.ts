import { buildDev } from '@storybook/core/server';
import { runNgcc } from './ngcc-execution';
import options from './options';

runNgcc();
buildDev(options);
