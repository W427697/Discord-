import { join } from 'path';

export const REPROS_DIRECTORY = join(__dirname, '..', '..', '..', 'repros');
export const BEFORE_DIR_NAME = 'before-storybook';
export const AFTER_DIR_NAME = 'after-storybook';
export const SCRIPT_TIMEOUT = 5 * 60 * 1000;
export const LOCAL_REGISTRY_URL = 'http://localhost:6001';
