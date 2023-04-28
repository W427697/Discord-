import { checkAddonOrder, serverRequire } from '@junk-temporary-prototypes/core-common';
import path from 'path';

export const checkDocsLoaded = (configDir: string) => {
  checkAddonOrder({
    before: {
      name: '@junk-temporary-prototypes/addon-docs',
      inEssentials: true,
    },
    after: {
      name: '@junk-temporary-prototypes/addon-controls',
      inEssentials: true,
    },
    configFile: path.isAbsolute(configDir)
      ? path.join(configDir, 'main')
      : path.join(process.cwd(), configDir, 'main'),
    getConfig: (configFile) => serverRequire(configFile),
  });
};
