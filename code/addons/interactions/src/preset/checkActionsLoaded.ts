import { checkAddonOrder, serverRequire } from '@junk-temporary-prototypes/core-common';
import path from 'path';

export const checkActionsLoaded = (configDir: string) => {
  checkAddonOrder({
    before: {
      name: '@junk-temporary-prototypes/addon-actions',
      inEssentials: true,
    },
    after: {
      name: '@junk-temporary-prototypes/addon-interactions',
      inEssentials: false,
    },
    configFile: path.isAbsolute(configDir)
      ? path.join(configDir, 'main')
      : path.join(process.cwd(), configDir, 'main'),
    getConfig: (configFile) => serverRequire(configFile),
  });
};
