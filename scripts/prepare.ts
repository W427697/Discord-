/* eslint-disable no-console */
import path from 'path';
import * as shell from 'shelljs';
import chalk from 'chalk';
import fse from 'fs-extra';
import { PackageJson } from 'type-fest';

const { hashElement } = require('folder-hash');

const { babelify } = require('./utils/compile-babel');
const { tscfy } = require('./utils/compile-tsc');

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
}

const ignore = [
  '__mocks__',
  '__snapshots__',
  '__testfixtures__',
  '__tests__',
  '/tests/',
  /.+\.test\..+/,
];

async function cleanup() {
  // remove files after babel --copy-files output
  // --copy-files option doesn't work with --ignore
  // https://github.com/babel/babel/issues/6226
  const dist = path.join(process.cwd(), 'dist');

  try {
    await fse.pathExists(dist);
  } catch (e) {
    return Promise.resolve();
  }

  const info = await Promise.all(
    [...shell.find('dist')].map(async (filePath) => {
      const isDir = (await fse.lstat(filePath)).isDirectory();
      return {
        filePath,
        isDir,
      };
    })
  );

  const files = info.filter(({ filePath, isDir }) => {
    // Do not remove folder
    // And do not clean anything for @storybook/cli/dist/generators/**/template* because these are the template files
    // that will be copied to init SB on users' projects
    if (isDir || /generators\/.+\/template.*/.test(filePath)) {
      return false;
    }

    // Remove all copied TS files (but not the .d.ts)
    if (/\.tsx?$/.test(filePath) && !/\.d\.ts$/.test(filePath)) {
      return true;
    }

    // @ts-ignore - TS
    return ignore.reduce((acc, pattern) => {
      return acc || !!filePath.match(pattern);
    }, false);
  });

  if (files.length) {
    shell.rm('-f', ...files.map((f) => f.filePath));
  }

  return Promise.resolve();
}

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
    const babelTask = babelify(options).then(cleanup);
    const typescriptTask = tscfy(options);

    const output = await allSettled([checksumTask, babelTask, typescriptTask]);

    const error = output.find((o) => o !== false);

    if (error) {
      console.log(chalk.gray(`Failed: ${logline}`));
      throw error;
    }

    console.log(chalk.gray(`Built: ${logline}`));

    return Promise.resolve();
  }
  console.log(chalk.gray(`Skipped: ${logline}`));
  return Promise.resolve();
};

const isWatchingEnabled = !!process.argv.find((a) => a === '--watch');
const isSilentEnabled = !!process.argv.find((a) => a === '--silent');
const isRegen = !!process.argv.find((a) => a === '--regen');

run({ watch: isWatchingEnabled, silent: isSilentEnabled, regen: isRegen } as Options).catch((e) => {
  console.error(e);

  removeDist();

  process.exitCode = 1;
});
