import path, { dirname, join } from 'path';
import { logger } from '@storybook/node-logger';
import { serverRequire, resolveAddonName, interopRequireDefault } from '@storybook/core-common';

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
  const checkInstalled = (addon: string, main: any) => {
    const existingAddon = main.addons?.find((entry: string | { name: string }) => {
      const name = typeof entry === 'string' ? entry : entry.name;
      return name?.startsWith(addon);
    });
    if (existingAddon) {
      logger.info(
        `[addon-essentials] Found existing addon ${JSON.stringify(existingAddon)}, skipping.`
      );
    }
    return !!existingAddon;
  };

  const main = requireMain(options.configDir);
  const addonNames = [
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
    .map((key) => `@storybook/addon-${key}`)
    .filter((addon) => !checkInstalled(addon, main));
  // Use require() to ensure Yarn PnP and pnpm compatibility
  // Files of various addons should be imported in the context of `addon-essentials` as they are listed as deps here
  // and not in `@storybook/core` nor in SB user projects. If `@storybook/core` make the require itself Yarn 2/pnpm will
  // throw an error saying that the package to require must be added as a dependency.

  return addonNames.map((addon) => {
    const name = resolveAddonName(options.configDir, addon, {});
    const parts = getContent(name);
    return parts;

    try {
      return dirname(require.resolve(join(addon, 'package.json')));
      // eslint-disable-next-line no-empty
    } catch (err) {}

    return require.resolve(addon);
  });
}

// copied from core-common and adjusted to create a `content` type
function getContent(input: any) {
  if (input.type === 'virtual') {
    const { type, name, ...rest } = input;

    const content: Record<string, any> = {
      name,
      type: 'content',
    };
    if (rest.managerEntries) {
      content.managerEntries = rest.managerEntries;
    }
    if (rest.previewAnnotations) {
      content.previewAnnotations = rest.previewAnnotations.map((name: string) =>
        interopRequireDefault(name)
      );
    }
    if (rest.presets) {
      content.presets = rest.presets;
    }
    return content;
  }
  const name = input.name ? input.name : input;

  return interopRequireDefault(name);
}
