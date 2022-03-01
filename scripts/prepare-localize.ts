import readPkgUp from 'read-pkg-up';
import builtins from 'builtin-modules';
import { ensureDir, stat, writeFile } from 'fs-extra';
import { join } from 'path';
import rollupTypescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { bold, gray } from 'chalk';
import { command } from 'execa';
import { cp, rm } from 'shelljs';
import glob from 'glob-promise';
import { transformFileAsync } from '@babel/core';
import { rollupModulesLocalisePlugin } from './localize-utils/rollup-modules-localize-plugin';
import * as prebundle from './bundle-package';
import { babelModulesLocalizePlugin } from './localize-utils/babel-modules-localize-plugin';
import { localize } from './localize-utils/localize';

interface Options {
  input: string;
  output?: string;
  externals: string[];
  cwd: string;
  optimized?: boolean;
  watch?: boolean;
}

// these packages have really dynamic requires at runtime, or they have some dependency that unresolvable
const ignoredPackagesWithWarnings = [
  'babel-loader',
  'browserslist',
  'fork-ts-checker-webpack-plugin',
  'html-minifier-terser',
  'import-fresh',
  'jest-worker',
  'loader-runner',
  'pnp-webpack-plugin',
  'postcss-loader',
  'ts-pnp',
  'url-loader',
  'worker-farm',
];
const run = async ({ cwd, flags }: { cwd: string; flags: string[] }) => {
  if (flags.includes('--reset')) {
    await prebundle.removeDist();
  }

  const { packageJson: pkg } = await readPkgUp({ cwd });
  const message = gray(`Built: ${bold(`${pkg.name}@${pkg.version}`)}`);
  console.time(message);

  const inputs = [].concat(pkg.bundlerEntrypoint);

  const options: Options = {
    cwd,
    externals: [
      ...Object.keys({ ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies }),
      ...builtins,
    ],
    input: inputs[0],
    optimized: flags.includes('--optimized'),
    watch: flags.includes('--watch'),
  };

  await Promise.all([
    ...inputs.map((input) =>
      prebundle.build(options, {
        input,
        external: [...options.externals, /local_modules/],
        treeshake: {
          preset: 'safest',
        },
        plugins: [
          nodeResolve({
            mainFields: ['main'],
            preferBuiltins: true,
          }),
          commonjs({
            ignoreGlobal: true,
          }),
          flags.includes('--optimized')
            ? rollupModulesLocalisePlugin(Object.keys(pkg.dependencies))
            : null,
          json(),
          rollupTypescript({ lib: ['es2015', 'dom', 'esnext'], target: 'es6' }),
        ].filter(Boolean),
      })
    ),
    prebundle.dts(options),
  ]);

  if (flags.includes('--optimized')) {
    const { stdout } = await command(`yarn info ${pkg.name} -R --json`);
    const {
      children: { Dependencies },
    } = JSON.parse(stdout);

    const list = (Dependencies as { descriptor: string; locator: string }[])
      .filter(({ descriptor }) => !descriptor.startsWith('@types/'))
      .filter(({ locator }) => !locator.includes('workspace:'))
      .map(({ locator, descriptor }) => {
        const version = locator.split('npm:')[1];
        const name = descriptor.split(/@npm|@virtual/)[0];
        return `${name}@${version}`;
      });

    const location = join(
      __dirname,
      '../../storybook-temp-modules',
      cwd.replace(join(__dirname, '..'), '')
    );

    const dist = join(cwd, 'dist');

    await ensureDir(location);
    await rm('-rf', location);
    await ensureDir(location);

    await ensureDir(dist);

    const afterInit = await command(`yarn init -i=classic -y`, { cwd: location });
    if (afterInit.failed) {
      console.error(afterInit.stderr);
      throw new Error('Failed to init package');
    }
    const afterAdd = await command(`npx add-dependencies ./package.json ${list.join(' ')}`, {
      cwd: location,
    });
    if (afterAdd.failed) {
      console.error(afterAdd.stderr);
      throw new Error('Failed to add dependencies');
    }
    const afterInstall = await command(
      `yarn install --ignore-scripts --ignore-engines --no-bin-links`,
      { cwd: location }
    );
    if (afterInstall.failed) {
      console.error(afterInstall.stderr);
      throw new Error('Failed to install dependencies');
    }

    await rm('-rf', [
      join(location, 'node_modules', `@(${[...builtins, 'string_decoder'].join('|')})`),

      // remove typings
      join(location, 'node_modules', '@types'),
      join(location, 'node_modules', '**', '*.d.ts'),
      join(location, 'node_modules', '**', '*.flow'),

      // remove sourcemaps
      join(location, 'node_modules', '**', '*.map'),

      // remove assets
      join(location, 'node_modules', '**', '*.md'),
      join(location, 'node_modules', '**', '*.markdown'),
      join(location, 'node_modules', '**', 'bower.json'),
      join(location, 'node_modules', '**', 'component.json'),
      join(location, 'node_modules', '**', 'gulpfile.js'),
      join(location, 'node_modules', '**', 'gulpfile.babel.js'),
      join(location, 'node_modules', '**', '@(jest|karma).config.js'),
      join(location, 'node_modules', '**', '*.@(png|jpg|jpeg|gif)'),
      join(location, 'node_modules', '**', '.*'),

      join(location, 'node_modules', 'webpack/bin', '**'),
      join(location, 'node_modules', 'mkdirp/bin', '**'),
      join(location, 'node_modules', 'fast-json-stable-stringify/benchmark', '**'),
      join(location, 'node_modules', 'errno/build.js'),
      join(location, 'node_modules', '@babel/helper-validator-identifier/scripts', '**'),
      join(location, 'node_modules', 'ajv/scripts', '**'),
      join(location, 'node_modules', '@webassemblyjs/*/scripts', '**'),

      join(location, 'node_modules', '@webassemblyjs/*/src', '**'),
      join(location, 'node_modules', '@webassemblyjs/helper-buffer/*/compare.js'),
      join(location, '**', 'node_modules', `@webassemblyjs/*`, `@(test|tests|spec|specs)`, '**'),

      // remove tests
      join(location, '**', 'node_modules', `*/@(test|tests|spec|specs)`, '**'),
      join(location, '**', 'node_modules', `*/@(example)`, '**'),
      join(location, '**', 'node_modules', `!(core-js)`, '**', `@(test|tests|spec|specs).js`),
      join(location, '**', 'node_modules', `object-inspect`, `test-core-js.js`),
      join(location, 'node_modules', '**', '*.test.*'),
      join(location, 'node_modules', '**', '*.spec.*'),
      join(location, 'node_modules', '**', '*.stories.*'),
    ]);

    // cleanup empty dirs
    await command('find . -type d -empty -print -delete', { cwd: location });

    const files = await glob.promise('node_modules/**/*.@(js|cjs)', { cwd: location });
    await files.reduce<any>(async (acc, file) => {
      await acc;
      const ref = join(location, file);

      if ((await stat(ref)).isDirectory()) {
        return Promise.resolve();
      }

      const reporter = (err: Error): void => {
        if (ignoredPackagesWithWarnings.some((p) => ref.includes(p))) {
          return;
        }
        console.log(`problem`);
        console.log(ref);
        console.log(err);
        console.log(``);
      };
      return transformFileAsync(ref, {
        comments: false,
        parserOpts: {
          // needed for watchpack/lib/chokidar.js
          allowReturnOutsideFunction: true,
        },
        plugins: [babelModulesLocalizePlugin(localize.bind(null, reporter, ref), reporter)],
      })
        .then(({ code }) => {
          return writeFile(ref, code);
        })
        .catch((e) => {
          console.log(`failure`);
          console.log(ref);
          console.log(e);
          console.log(``);
          //
        });
    }, Promise.resolve());

    await cp('-R', join(location, 'node_modules'), join(dist, 'node_modules'));
    await command('find . -depth -name node_modules -type d -execdir mv {} local_modules ;', {
      cwd: dist,
    });

    await rm('-rf', location);
  }

  console.timeEnd(message);
};

const flags = process.argv.slice(2);
const cwd = process.cwd();

run({ cwd, flags }).catch((e) => {
  console.error(e);
  process.exit(1);
});
