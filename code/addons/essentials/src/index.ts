import path from 'path';
import { logger } from '@junk-temporary-prototypes/node-logger';
import { serverRequire } from '@junk-temporary-prototypes/core-common';

interface PresetOptions {
  configDir: string;
  docs?: boolean;
  controls?: boolean;
  actions?: boolean;
  backgrounds?: boolean;
  viewport?: boolean;
  toolbars?: boolean;
  measure?: boolean;
  outline?: boolean;
}

const requireMain = (configDir: string) => {
  const absoluteConfigDir = path.isAbsolute(configDir)
    ? configDir
    : path.join(process.cwd(), configDir);
  const mainFile = path.join(absoluteConfigDir, 'main');

  return serverRequire(mainFile) ?? {};
};

export function addons(options: PresetOptions) {
  const checkInstalled = (addonName: string, main: any) => {
    const addon = `@junk-temporary-prototypes/addon-${addonName}`;
    const existingAddon = main.addons?.find((entry: string | { name: string }) => {
      const name = typeof entry === 'string' ? entry : entry.name;
      return name?.startsWith(addon);
    });
    if (existingAddon) {
      logger.info(`Found existing addon ${JSON.stringify(existingAddon)}, skipping.`);
    }
    return !!existingAddon;
  };

  const main = requireMain(options.configDir);
  return [
    'docs',
    'controls',
    'actions',
    'backgrounds',
    'viewport',
    'toolbars',
    'measure',
    'outline',
    'highlight',
  ]
    .filter((key) => (options as any)[key] !== false)
    .filter((addon) => !checkInstalled(addon, main))
    .map((addon) => {
      // We point to the re-export from addon-essentials to support yarn pnp and pnpm.
      return `@junk-temporary-prototypes/addon-essentials/${addon}`;
    });
}
