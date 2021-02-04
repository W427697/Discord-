import { logger } from '@storybook/node-logger';
import { sync as spawnSync } from 'cross-spawn';

export function runNgcc() {
  logger.info('=> Run ngcc if available');
  const ngccArgs = [
    '--create-ivy-entry-points',
    '--target',
    '@angular/platform-browser-dynamic',
    '--first-only',
  ];

  // TODO: force yarn for test purposes
  spawnSync('yarn ngcc', ngccArgs, {
    stdio: 'inherit',
  });
}
