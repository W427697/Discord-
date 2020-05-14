/* eslint-disable no-console */
const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');

function getCommand(watch) {
  const tsc = path.join(__dirname, '..', 'node_modules', '.bin', 'tsc');
  const downlevelDts = path.join(__dirname, '..', 'node_modules', '.bin', 'downlevel-dts');

  const args = ['--outDir ./dist', '--listEmittedFiles true'];

  /**
   * Only emit declarations if it does not need to be compiled with tsc
   * Currently, angular and storyshots (that contains an angular component) need to be compiled
   * with tsc. (see comments in compile-babel.js)
   */
  const isAngular = process.cwd().includes(path.join('app', 'angular'));
  const isStoryshots = process.cwd().includes(path.join('addons', 'storyshots'));
  if (!isAngular && !isStoryshots) {
    args.push('--emitDeclarationOnly --declaration true');
  }

  if (isAngular) {
    args.push('--declaration true');
  }

  if (watch) {
    args.push('-w');
  }

  return `${tsc} ${args.join(' ')} && ${downlevelDts} dist ts3.5/dist`;
}

async function tscfy(options = {}) {
  const { watch = false, silent = true } = options;
  const tsConfigFile = 'tsconfig.json';

  try {
    await Promise.all([fs.exists('src'), fs.exists(tsConfigFile)]);
  } catch (e) {
    return Promise.resolve();
  }

  const tsConfig = await fs.readJSON(tsConfigFile);

  if (tsConfig && tsConfig.lerna && tsConfig.lerna.disabled === true) {
    if (!silent) {
      console.log('Lerna disabled');
    }
    return Promise.resolve();
  }

  const command = getCommand(watch);

  return new Promise((resolve, reject) => {
    shell.exec(command, { silent }, (code, stdout, stderr) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(stderr);
      }
    });
  });
}

module.exports = {
  tscfy,
};
