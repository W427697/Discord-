/* eslint-disable no-console */
import path from 'path';
import * as shell from 'shelljs';
import chalk from 'chalk';
import fse from 'fs-extra';
import { PackageJson } from 'type-fest';

const { hashElement } = require('folder-hash');

const { babelify } = require('./utils/compile-babel');
const { tscfy, downgrade } = require('./utils/compile-tsc');

interface Info {
  modulePath: string;
  packagePath: string;
  checksumPath: string;
  package: PackageJson;
  checksum: {
    checksum: string;
  };
}

async function getInfo(): Promise<Info> {
  const modulePath = path.resolve('./');
  const packagePath = path.join(modulePath, 'package.json');
  const checksumPath = path.join(modulePath, 'dist', 'checksum.json');

  const exists = await fse.pathExists(checksumPath);

  if (!exists) {
    await fse.ensureFile(checksumPath);
    await fse.writeJSON(checksumPath, {});
  }

  return {
    modulePath,
    packagePath,
    checksumPath,
    package: await fse.readJSON(packagePath),
    checksum: await fse.readJSON(checksumPath),
  };
}

async function createChecksum({ modulePath }: Info) {
  const { hash } = await hashElement(path.join(modulePath, 'src'), {
    folders: { exclude: ['tests', '__mocks__', '__tests__'] },
    files: {
      include: ['*.js', '*.jsx', '*.ts', '*.jsx', '*.json'],
      exclude: ['*.test.*', '*.stories.*'],
    },
  });

  return hash;
}

async function writeChecksum(checksum: string, { checksumPath }: Info) {
  const exists = await fse.pathExists(checksumPath);

  if (!exists) {
    await fse.ensureFile(checksumPath);
  }

  return fse.writeJSON(checksumPath, { checksum }, { spaces: 2 });
}

async function compareChecksum(info: Info) {
  const { checksum: existing } = info.checksum || {};

  const future = await createChecksum(info);

  const equal = existing === future;
  const checksum = equal ? existing : future;

  return {
    existing,
    future,
    checksum,
    equal,
  };
}

function removeDist() {
  shell.rm('-rf', 'dist');
  shell.rm('-f', 'tsconfig.tsbuildinfo');
}

// turn a list of promises into a single promise that resolves into Array<false | Error>
// used to perform tasks in parallel, and assert no errors occurred
const allSettled = async (list: Promise<any>[]) => {
  return Promise.all(
    list.map((l) =>
      l.then(
        () => false,
        (e) => e
      )
    )
  );
};

interface Options {
  watch: boolean;
  regen: boolean;
  silent: boolean;
  downgrade: boolean;
}

const run = async (options: Options) => {
  if (options.regen) {
    removeDist();
  }

  const [src, dist] = await Promise.all([fse.pathExists('src'), fse.pathExists('dist')]);

  if (!src) {
    return Promise.resolve();
  }

  const info = await getInfo();
  const { checksum, equal } = await compareChecksum(info);

  const logline = chalk.bold(`${info.package.name}@${info.package.version}`);

  if (!dist || options.watch || !equal) {
    if (!options.watch) {
      removeDist();
    }

    const checksumTask = writeChecksum(checksum, info);
    const babelTask = babelify(options);
    const typescriptTask = tscfy(options);

    const output = await allSettled([checksumTask, babelTask, typescriptTask]);

    const error = output.find((o) => o !== false);

    if (!options.downgrade && !error) {
      await downgrade(options);
    }

    if (error) {
      console.log(chalk.red(`Failed: ${logline}`));
      throw error;
    }

    console.log(chalk.yellow(`Built: ${logline}`));

    return Promise.resolve();
  }
  console.log(chalk.blue(`Skipped: ${logline}`));
  return Promise.resolve();
};

const isWatchingEnabled = !!process.argv.find((a) => a === '--watch');
const isDowngrade = !!process.argv.find((a) => a === '--tsdowngrade');
const isSilentEnabled = !!process.argv.find((a) => a === '--silent');
const isRegen = !!process.argv.find((a) => a === '--regen');

run({
  watch: isWatchingEnabled,
  silent: isSilentEnabled,
  regen: isRegen,
  downgrade: isDowngrade,
} as Options).catch((e) => {
  console.error(e);

  removeDist();

  process.exitCode = 1;
});
