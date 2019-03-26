import { Plugin } from 'rollup';

interface Input {
  [id: string]: string;
}

export default function virtualModule(config: Input) {
  const plugin: Plugin = {
    name: 'virtual-module',
    resolveId(importee) {
      if (config[importee]) {
        return importee;
      }
      return null;
    },
    load(id) {
      if (config[id]) {
        return config[id];
      }
      return null;
    },
  };
  return plugin;
}
