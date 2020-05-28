/* eslint-disable no-console */
import fs from 'fs-extra';
import path from 'path';
import waitOn from 'wait-on';
import { spawn } from 'child_process';

const getTSCModulePath = () => {
  return path.join(__dirname, '..', '..', 'node_modules', '.bin', 'tsc');
};
const getDownlevelModulePath = () => {
  return path.join(__dirname, '..', '..', 'node_modules', '.bin', 'downlevel-dts');
};
const getArguments = ({
  watch,
  isAngular,
  isStoryshots,
}: Options & { isAngular: boolean; isStoryshots: boolean }) => {
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

const exists = async (location: string) => {
  try {
    return !!(await fs.pathExists(location));
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

const shouldRun = async ({ silent }: Options) => {
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

interface Options {
  watch?: boolean;
  silent?: boolean;
}

async function tscfy(options: Options = {}) {
  const startTime = Date.now();
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
    const files: string[] = [];
    let stderr = '';
    let stdout = '';

    child.stdout.on('data', (data) => {
      if (data) {
        const { entries, out } = data
          .toString()
          .split(/\r?\n/)
          .reduce(
            (acc: { entries: string[]; out: string[] }, line: string) => {
              if (line.toString().startsWith('TSFILE')) {
                acc.entries.push(line.replace('TSFILE: ', ''));
              } else {
                acc.out.push(line);
                if (options.watch) {
                  console.log(line);
                }
              }
              return acc;
            },
            { entries: [], out: [] }
          );
        stdout += out;
        files.push(...entries);
      }
    });

    child.stderr.on('data', (data) => {
      stderr += data;
    });

    child.on('close', (code) => {
      if (code === 0) {
        const time = Date.now() - startTime;
        console.log(`Successfully compiled ${files.length} files with TSC (${time}ms).`);
        waitOn({ resources: files }).then(resolve);
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
