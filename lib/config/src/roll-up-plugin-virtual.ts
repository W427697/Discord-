import { Plugin } from 'rollup';

interface Input {
  [id: string]: string;
}

export default function virtualModule(config: Input) {
  const plugin: Plugin = {
    name: 'virtual-module',
    resolveId(importee) {
      if (typeof config[importee] !== 'undefined') {
        return importee;
      }
      return null;
    },
    load(id) {
      if (typeof config[id] !== 'undefined') {
        return config[id];
      }
      return null;
    },
  };
  return plugin;
}
