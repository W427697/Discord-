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

// Sometimes webpack paths have a URL parameter appended to them, such as ?ngResource.
// Those should be stripped.
const normalize = (id: string) => {
  const CSF_REGEX = /\s+sync\s+/g;
  const URL_PARAM_REGEX = /(\?.*)/g;
  return URL_PARAM_REGEX.test(id) && !CSF_REGEX.test(id) ? id.replace(URL_PARAM_REGEX, '') : id;
};

export const webpackStatsToModulesJson = (stats: Stats) => {
  const { modules } = stats.toJson() as WebpackStats;
  const modulesById = new Map(modules.map((m) => [normalize(m.id || m.name), m]));

  const data = new Map<string, Module>();
  const add = ({ id, modules, reasons }: WebpackModule) => {
    if (modules?.length) {
      modules.forEach(add);
      return;
    }

    const identifier = normalize(id);
    if (!identifier || identifier.startsWith('webpack/')) {
      return;
    }

    const item = data.get(identifier) || { reasons: new Set() };
    reasons?.forEach(({ moduleId }) => {
      const reason = modulesById.get(normalize(moduleId));
      if (!reason) return;
      if (reason.modules?.length) {
        reason.modules.forEach((mod) => {
          const id = normalize(mod.id);
          if (id !== identifier) item.reasons.add(id);
        });
      } else {
        item.reasons.add(normalize(reason.id));
      }
    });
    data.set(identifier, item);
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
  const filePath = path.join(directory, 'modules.json');
  const modules = webpackStatsToModulesJson(stats);
  await new Promise((resolve, reject) => {
    stringifyStream({ v: 1, modules }, replacer, 2)
      .on('error', reject)
      .pipe(fs.createWriteStream(filePath))
      .on('error', reject)
      .on('finish', resolve);
  });
  logger.info(`=> module dependencies written to ${chalk.cyan(filePath)}`);
  return filePath;
};
