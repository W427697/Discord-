import { logger } from '@storybook/node-logger';
import { getStorybookConfigPath } from '@storybook/config';
import { buildDev } from '@storybook/core/server';
import options from './options';

const configPath = getStorybookConfigPath();
logger.info(configPath);
buildDev(options);
