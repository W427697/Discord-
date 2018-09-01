#!/usr/bin/env node
/* eslint-disable no-console */
import { exec } from 'child_process';
import path from 'path';
import program from 'commander';
import Server from '../server';

program
  .option('-h, --host <host>', 'host to listen on')
  .option('-p, --port <port>', 'port to listen on')
  .option('--haul <configFile>', 'DEPRECATED. use haul with config file')
  .option('--platform <ios|android|all>', 'DEPRECATED.  build platform-specific build')
  .option('-s, --secured', 'whether server is running on https')
  .option('-c, --config-dir [dir-name]', 'storybook config directory')
  .option('--metro-config [relative-config-path]', 'DEPRECATED. Metro Bundler Custom config')
  .option('-e, --environment [environment]', 'DEVELOPMENT/PRODUCTION environment for webpack')
  .option('-r, --reset-cache', 'DEPRECATED. reset react native packager')
  .option('--skip-packager', "DEPRECATED. Doesn't do anything")
  .option(
    '--start-packager',
    'DEPRECATED. run packager together with storybook server (entry point is ./storybook folder) '
  )
  .option('-i, --manual-id', 'allow multiple users to work with same storybook')
  .option('--smoke-test', 'Exit after successful start')
  .option('--packager-port <packagerPort>', 'DEPRECATED. Custom packager port')
  .option(
    '--root [root]',
    'DEPRECATED. Add additional root(s) to be used by the packager in this project'
  )
  .option(
    '--projectRoots [projectRoots]',
    'DEPRECATED. Override the root(s) to be used by the packager'
  )
  .parse(process.argv);

const projectDir = path.resolve();
const configDir = path.resolve(program.configDir || './storybook');
const listenAddr = [program.port];
if (program.host) {
  listenAddr.push(program.host);
}

const server = new Server({
  projectDir,
  configDir,
  environment: program.environment,
  manualId: program.manualId,
  secured: program.secured,
});

server.listen(...listenAddr, err => {
  if (err) {
    throw err;
  }
  const address = `http://${program.host || 'localhost'}:${program.port}/`;
  console.info(`\nReact Native Storybook started on => ${address}\n`);
  if (program.smokeTest) {
    process.exit(0);
  }
});

if (program.startPackager) {
  console.warn(
    `--startPackager --root --projectRoots --reset-cache --haul --platform --metro-config are deprecated. Use storybookUI directly in your code`
  );

  let symlinks = [];

  let roots = [projectDir];

  if (program.root) {
    roots = roots.concat(program.root.split(',').map(root => path.resolve(root)));
  }

  try {
    // eslint-disable-next-line global-require
    require('babel-register')({
      presets: [require.resolve('babel-preset-flow')],
      ignore: false,
      babelrc: false,
    });

    // eslint-disable-next-line global-require
    const findSymlinkedModules = require('react-native/local-cli/util/findSymlinkedModules');
    symlinks = roots.reduce((arr, rootPath) => arr.concat(findSymlinkedModules(rootPath, roots)), [
      ...roots,
    ]);
  } catch (e) {
    console.warn(`Unable to load findSymlinksPaths: ${e.message}`, e);
  }

  let projectRoots = (configDir === projectDir ? [] : [configDir]).concat(symlinks);

  if (program.projectRoots) {
    projectRoots = projectRoots.concat(
      program.projectRoots.split(',').map(root => path.resolve(root))
    );
  }

  let cliCommand = 'react-native start';

  if (program.metroConfig) {
    cliCommand += ` --config ${program.metroConfig}`;
  }

  if (program.haul) {
    const platform = program.platform || 'all';
    cliCommand = `haul start --config ${program.haul} --platform ${platform}`;
  }
  // RN packager
  exec(
    [
      cliCommand,
      `--projectRoots ${projectRoots.join(',')}`,
      program.resetCache && '--reset-cache',
      program.packagerPort && `--port=${program.packagerPort}`,
    ]
      .filter(x => x)
      .join(' '),
    { async: true }
  );
}
