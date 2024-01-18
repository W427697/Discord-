import path from 'path';
import type { Options } from '@storybook/types';

interface PropertyObject {
  name: string;
  options?: Record<string, any>;
}

type Property = string | PropertyObject | undefined;

export const pluckNameFromConfigProperty = (property: Property) => {
  if (!property) {
    return undefined;
  }

  return typeof property === 'string' ? property : property.name;
};

export const pluckStorybookPackageFromPath = (packagePath: string) =>
  packagePath.match(/(@storybook\/.*)$/)?.[1];

export const pluckThirdPartyPackageFromPath = (packagePath: string) =>
  packagePath.split(`${path.sep}node_modules${path.sep}`)[1] ?? packagePath;

export const buildFrameworkGlobalsFromOptions = async (options: Options) => {
  const globals: Record<string, any> = {};

  const { renderer, builder } = await options.presets.apply('core');

  const rendererName = pluckNameFromConfigProperty(renderer);
  if (rendererName) {
    globals.STORYBOOK_RENDERER =
      pluckStorybookPackageFromPath(rendererName) ?? pluckThirdPartyPackageFromPath(rendererName);
  }

  const builderName = pluckNameFromConfigProperty(builder);
  if (builderName) {
    globals.STORYBOOK_BUILDER =
      pluckStorybookPackageFromPath(builderName) ?? pluckThirdPartyPackageFromPath(builderName);
  }

  const framework = pluckNameFromConfigProperty(await options.presets.apply('framework'));
  if (framework) {
    globals.STORYBOOK_FRAMEWORK = framework;
  }

  return globals;
};
