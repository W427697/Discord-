import type { Options } from '@storybook/types';

interface PropertyObject {
  name: string;
  options?: Record<string, any>;
}

type Property = string | PropertyObject | undefined;

const pluckNameFromConfigProperty = (property: Property) => {
  if (!property) {
    return undefined;
  }

  return typeof property === 'string' ? property : property.name;
};

export const buildFrameworkGlobalsFromOptions = async (options: Options) => {
  const globals: Record<string, any> = {};

  const { renderer, builder } = await options.presets.apply('core');

  const rendererName = pluckNameFromConfigProperty(renderer);
  if (rendererName) {
    globals.STORYBOOK_RENDERER = rendererName;
  }

  const builderName = pluckNameFromConfigProperty(builder);
  if (builderName) {
    globals.STORYBOOK_BUILDER = builderName;
  }

  const framework = pluckNameFromConfigProperty(await options.presets.apply('framework'));
  if (framework) {
    globals.STORYBOOK_FRAMEWORK = framework;
  }

  return globals;
};
