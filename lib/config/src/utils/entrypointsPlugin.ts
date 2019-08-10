/* TODO: THIS IS A DOWNLOADED + MODIFIED MODULE
 * after PR is merged + released, we should switch back
 * PR: https://github.com/8427003/wildcards-entry-webpack-plugin/pull/9
 */

import glob from 'fast-glob';
import { Compiler } from 'webpack';
import camelcase from 'camelcase';
import { mergeConfig } from './mergeConfig';

function getEntryName(item: string, commonPrefix: string) {
  return `preview/${camelcase(trimExtensions(item).replace(commonPrefix, ''))}`;
}

interface Options {
  prefix: string;
  basedir: string;
}

const defaults = {
  prefix: '',
  basedir: process.cwd(),
};

const trimExtensions = (p: string): string => p.replace(/\..*/, '');

const longestCommonPrefix = (inputs: string[]): string => {
  if (!inputs[0]) return '';
  let res = '';
  let cur = '';
  let i = 0;
  while (i < inputs[0].length) {
    cur = inputs[0].substring(0, i + 1);
    // eslint-disable-next-line no-loop-func
    const flag = inputs.every(x => x.startsWith(cur));
    if (flag === true) {
      res = cur;
    } else break;
    // eslint-disable-next-line no-plusplus
    i++;
  }
  return res;
};

const convertFileToEntry = (item: string, commonPrefix: string): { [key: string]: string } => ({
  [getEntryName(item, commonPrefix)]: `./${item}`,
});

class WildcardsEntryWebpackPlugin {
  constructor(patterns: string[], config: Options) {
    this.config = config;
    this.patterns = patterns;
  }

  patterns: string[];

  config: Options;

  apply(compiler: Compiler) {
    compiler.hooks.afterCompile.tap('EntrypointsPlugin', compilation => {
      this.patterns.forEach(p => compilation.contextDependencies.add(p));
    });
    compiler.hooks.compilation.tap('EntrypointPlugin', compilation => {
      compilation.hooks.buildModule.tap('EntrpointPlugin', m => {
        // console.log(m);
      });
    });
  }
}

export const create = (patterns: string[], options: Partial<Options>) => {
  const config = mergeConfig({}, defaults, options);
  const { basedir, prefix } = config;

  return {
    entries: async () => {
      const files = await glob(patterns);

      const commonPrefix = longestCommonPrefix(files);

      const entries = files.reduce(
        (acc, item) => Object.assign(acc, convertFileToEntry(item, commonPrefix)),
        {}
      );

      return entries;
    },
    plugin: new WildcardsEntryWebpackPlugin(patterns, config),
  };
};
