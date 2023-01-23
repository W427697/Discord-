import { stringifyStream } from '@discoveryjs/json-ext';
import { logger } from '@storybook/node-logger';
import type { Stats } from '@storybook/types';
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
  type: 'stories' | 'source';
  reasons: Set<string>;
}

// Only StoryStore v7+ is supported
const ENTRY_MODULE_REGEXP = /\/storybook-stories\.js$/;

// Sometimes webpack paths have a URL parameter appended to them, such as ?ngResource.
// Those should be stripped.
const normalize = (id: string) => {
  const CSF_REGEX = /\s+sync\s+/g;
  const URL_PARAM_REGEX = /(\?.*)/g;
  return URL_PARAM_REGEX.test(id) && !CSF_REGEX.test(id) ? id.replace(URL_PARAM_REGEX, '') : id;
};

export const webpackStatsToModulesJson = (stats: Stats): Map<string, Module> => {
  const { modules } = stats.toJson() as WebpackStats;
  const modulesById = new Map(modules.map((m) => [normalize(m.id || m.name), m]));

  const traced: Record<string, Omit<Module, 'type'> & { type: 'entry' | 'glob' | 'source' }> = {};
  const trace = (module: WebpackModule) => {
    if (module.modules?.length) {
      // Bundles are "unpacked" and not traced themselves
      module.modules.forEach(trace);
      return;
    }

    const identifier = normalize(module.id);
    if (!identifier || identifier.startsWith('webpack/')) {
      return;
    }

    const item = traced[identifier] || {
      type: ENTRY_MODULE_REGEXP.test(module.id) ? 'entry' : 'source',
      reasons: new Set(),
    };

    module.reasons?.forEach(({ moduleId }) => {
      const reasonId = normalize(moduleId);
      const reason = modulesById.get(reasonId);
      if (!reason) return;

      if (ENTRY_MODULE_REGEXP.test(moduleId)) {
        // CSF globs have the entry point as their "parent" reason
        item.type = 'glob';
      }

      if (reason.modules?.length) {
        // If reason is a bundle, unpack it
        reason.modules.forEach((mod) => {
          const id = normalize(mod.id);
          // Ignore self-references where a module imports its own bundle
          if (id !== identifier) item.reasons.add(id);
        });
      } else {
        item.reasons.add(normalize(reason.id));
      }
    });

    traced[identifier] = item;
  };

  modules.forEach(trace);

  return new Map(
    // Omit entry file, CSF globs and unlinked files, and mark the rest as stories or source
    Object.entries(traced).reduce((acc, [id, { type, reasons }]) => {
      if (['entry', 'glob'].includes(type) || !reasons.size) return acc;
      const isStoriesFile = Array.from(reasons).some((r) => traced[r].type === 'glob');
      acc.push([id, { type: isStoriesFile ? 'stories' : 'source', reasons }]);
      return acc;
    }, [])
  );
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
