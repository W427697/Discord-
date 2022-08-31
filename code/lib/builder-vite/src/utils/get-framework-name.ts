import type { ExtendedOptions } from '../types';

export async function getFrameworkName(options: ExtendedOptions) {
  const framework = await options.presets.apply('framework', '', options);
  return typeof framework === 'object' ? framework.name : framework;
}
