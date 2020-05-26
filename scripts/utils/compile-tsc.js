/* eslint-disable no-console */
const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

const getTSCModulePath = () => {
  return path.join(__dirname, '..', '..', 'node_modules', '.bin', 'tsc');
};
const getDownlevelModulePath = () => {
  return path.join(__dirname, '..', '..', 'node_modules', '.bin', 'downlevel-dts');
};
const getArguments = ({ watch, isAngular, isStoryshots }) => {
  const args = ['--outDir', './dist', '--incremental'];

  if (!isAngular && !isStoryshots) {
    args.push('--emitDeclarationOnly');
    args.push('--declaration', 'true');
  }

  if (isAngular) {
    args.push('--declaration', 'true');
  }

  if (watch) {
    args.push('--watch');
  } else {
    args.push('--listEmittedFiles', 'true');
  }

  return args;
};

const exists = async (location) => {
  try {
    return !!(await fs.exists(location));
  } catch (e) {
    return false;
  }
};

async function downgrade(options = {}) {
  const perform = await shouldRun(options);

  if (!perform) {
    return Promise.resolve();
  }

  const cwd = process.cwd();
  const downgradePath = getDownlevelModulePath();
  const args = ['dist', 'ts3.5/dist'];

  return new Promise((resolve, reject) => {
    const child = spawn(downgradePath, args, {
      cwd,
      stdio: [null, null, null],
    });

    child.stdout.on('data', (data) => {
      console.log(data);
    });

    child.stderr.on('data', (data) => {
      console.log(data);
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`Successfully downgraded with downlevel-dts.`);
        resolve();
      } else {
        reject();
      }
    });
  });
}

const shouldRun = async ({ silent }) => {
  const [src, tsConfigFile] = await Promise.all([exists('src'), exists('tsconfig.json')]);

  if (!src || !tsConfigFile) {
    return false;
  }

  const tsConfig = await fs.readJSON('tsconfig.json');

  if (tsConfig && tsConfig.lerna && tsConfig.lerna.disabled === true) {
    if (!silent) {
      console.log('Lerna disabled');
    }
    return false;
  }

  return true;
};

async function tscfy(options = {}) {
  const perform = await shouldRun(options);

  if (!perform) {
    return Promise.resolve();
  }

  const { watch = false } = options;
  const cwd = process.cwd();
  const isAngular = process.cwd().includes(path.join('app', 'angular'));
  const isStoryshots = process.cwd().includes(path.join('addons', 'storyshots'));

  const tscPath = getTSCModulePath();
  const args = getArguments({ watch, isAngular, isStoryshots });

  return new Promise((resolve, reject) => {
    const child = spawn(tscPath, args, { cwd, stdio: [null, null, null] });
    let count = 0;
    let stderr = '';
    let stdout = '';

    child.stdout.on('data', (data) => {
      if (data) {
        const { files, out } = data
          .toString()
          .split(/\r?\n/)
          .reduce(
            (acc, line) => {
              if (line.toString().startsWith('TSFILE')) {
                acc.files.push(line);
              } else {
                acc.out.push(line);
                if (options.watch) {
                  console.log(line);
                }
              }
              return acc;
            },
            { files: [], out: [] }
          );
        stdout += out;
        count += files.length;
      }
    });

    child.stderr.on('data', (data) => {
      stderr += data;
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`Successfully compiled ${count} files with TSC.`);
        resolve();
      } else {
        reject(stderr || stdout);
      }
    });
  });
}

module.exports = {
  tscfy,
  downgrade,
};
