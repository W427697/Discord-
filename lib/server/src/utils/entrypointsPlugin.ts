/* TODO: THIS IS A DOWNLOADED + MODIFIED MODULE
 * after PR is merged + released, we should switch back
 * PR: https://github.com/8427003/wildcards-entry-webpack-plugin/pull/9
 */

// import path from 'path';
import glob from 'fast-glob';
import { Compiler } from 'webpack';
import { merge } from './merge';

// function getEntryName(pathname, basedir, extname) {
//   let name;
//   if (pathname.startsWith(basedir)) {
//     name = pathname.substring(basedir.length + 1);
//   }
//   return name;
// }

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
    const flag = inputs.every(x => x.startsWith(cur));
    if (flag === true) {
      res = cur;
    } else break;
    i++;
  }
  return res;
};

const convertFileToEntry = (item: string, commonPrefix: string): { [key: string]: string } => ({
  [trimExtensions(item).replace(commonPrefix, '')]: item,
});

export const create = (patterns: string[], options: Partial<Options>) => {
  const config = merge({}, defaults, options);
  const { basedir, prefix } = config;

  return {
    entries: async () => {
      const files = await glob(patterns);

      const commonPrefix = longestCommonPrefix(files);

      const entries = files.reduce(
        (acc, item) => Object.assign(acc, convertFileToEntry(item, commonPrefix)),
        {}
      );

      console.log({ files, entries });

      return {};
    },
    plugin: new WildcardsEntryWebpackPlugin(patterns, config),
  };
};

class WildcardsEntryWebpackPlugin {
  constructor(patterns: string[], config: Options) {
    this.config = config;
    this.patterns = patterns;
  }

  patterns: string[];

  config: Options;

  // make an entry name for every wildcards file;
  // ├── src
  //     ├── a.js
  //     ├── b.js
  //     ├── c.js
  //     └── js
  //         └── index.js
  //
  // eg 1:    @wildcards: "./src/**/*.js", we will watch './src', and chunk name 'js/index'
  // eg 2:    @wildcards: "./src/js/**/*.js", we will watch './src/js', and chunk name 'index'
  // eg 3:    @wildcards: "./src/js/**/*.js", @assignEntry: {xxx:'./src/a.js'} and chunk name {index:..., xxx...}
  //
  //
  //
  // @wildcards  string
  // @assignEntry object optional
  // static entry(wildcards, assignEntry, namePrefix) {
  //   if (!wildcards) {
  //     throw new Error(
  //       'please give me a wildcards path by invoke WildcardsEntryWebpackPlugin.entry!'
  //     );
  //   }

  //   namePrefix = namePrefix ? `${namePrefix}/` : '';
  //   let basedir;
  //   let flagIndex = wildcards.indexOf('/*');

  //   if (flagIndex === -1) {
  //     flagIndex = wildcards.lastIndexOf('/');
  //   }
  //   basedir = wildcards.substring(0, flagIndex);
  //   const file = wildcards.substring(flagIndex + 1);

  //   basedir = path.resolve(process.cwd(), basedir);
  //   globBasedir = basedir = path.normalize(basedir);

  //   return () => {
  //     const files = glob.sync(path.resolve(basedir, file));
  //     const entries = {};
  //     let entry;
  //     let dirname;
  //     let basename;
  //     let pathname;
  //     let extname;

  //     for (let i = 0; i < files.length; i++) {
  //       entry = files[i];
  //       dirname = path.dirname(entry);
  //       extname = path.extname(entry);
  //       basename = path.basename(entry, extname);
  //       pathname = path.normalize(path.join(dirname, basename));
  //       pathname = getEntryName(pathname, basedir, extname);
  //       entries[namePrefix + pathname] = [entry];
  //     }
  //     Object.assign(entries, assignEntry);
  //     return entries;
  //   };
  // }

  apply(compiler: Compiler) {
    compiler.hooks.afterCompile.tap('EntrypointsPlugin', compilation => {
      this.patterns.forEach(p => compilation.contextDependencies.add(p));
    });
  }
}
