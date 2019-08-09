import { CallOptions } from '../types/cli';
import { Preset } from '../types/presets';

export const createCallPreset = (callOptions: CallOptions): Preset => {
  const { frameworkPresets, overridePresets, middleware } = callOptions;
  return {
    presets: [].concat(frameworkPresets || []).concat(overridePresets),
    server: base => ({
      ...base,
      middleware: [].concat(base.middleware || []).concat(middleware),
    }),
  };
};
