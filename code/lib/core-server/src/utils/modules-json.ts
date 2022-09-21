import { stringifyStream } from '@discoveryjs/json-ext';
import { logger } from '@storybook/node-logger';
import type { Stats } from '@storybook/core-common';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

interface WebpackModule {
  id: string;
  name: string;
  modules?: WebpackModule[];
  reasons?: { moduleId: string }[];
}

interface WebpackStats {
  modules: WebpackModule[];
}

interface Module {
  reasons: Set<string>;
}

const webpackStatsToModulesJson = (stats: Stats) => {
  const { modules } = stats.toJson() as WebpackStats;
  const modulesById = new Map(modules.map((m) => [m.id, m]));

  const data = new Map<string, Module>();
  const add = ({ name, modules, reasons }: WebpackModule) => {
    if (!name || name.startsWith('webpack/')) return;
    if (modules?.length) modules.forEach(add);
    else {
      const item = data.get(name) || { reasons: new Set() };
      reasons?.forEach(({ moduleId }) => {
        const reason = modulesById.get(moduleId);
        if (reason.modules?.length) reason.modules.forEach((mod) => item.reasons.add(mod.name));
        else item.reasons.add(reason.name);
      });
      data.set(name, item);
    }
  };
  modules.forEach(add);
  return data;
};

const replacer = (key: any, value: any) => {
  if (value instanceof Map) return Object.fromEntries(value.entries());
  if (value instanceof Set) return Array.from(value.values());
  return value;
};

export const writeModulesJson = async (directory: string, stats: Stats) => {
  const filePath = path.join(directory, `modules.json`);
  const modules = webpackStatsToModulesJson(stats);
  await new Promise((resolve, reject) => {
    stringifyStream({ modules }, replacer, 2)
      .on('error', reject)
      .pipe(fs.createWriteStream(filePath))
      .on('error', reject)
      .on('finish', resolve);
  });
  logger.info(`=> module dependencies written to ${chalk.cyan(filePath)}`);
  return filePath;
};
