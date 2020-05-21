/* eslint-disable no-console */
const path = require('path');
const shell = require('shelljs');
const chalk = require('chalk');
const fs = require('fs-extra');

const { hashElement } = require('folder-hash');

const { babelify } = require('./utils/compile-babel');
const { tscfy } = require('./utils/compile-tsc');

async function getInfo() {
  const modulePath = path.resolve('./');
  const packagePath = path.join(modulePath, 'package.json');
  const checksumPath = path.join(modulePath, 'dist', 'checksum.json');

  const exists = await fs.exists(checksumPath);

  if (!exists) {
    await fs.ensureFile(checksumPath);
    await fs.writeJSON(checksumPath, {});
  }

  return {
    modulePath,
    packagePath,
    checksumPath,
    package: await fs.readJSON(packagePath),
    checksum: await fs.readJSON(checksumPath),
  };
}

async function createChecksum({ modulePath }) {
  const { hash } = await hashElement(path.join(modulePath, 'src'), {
    folders: { exclude: ['tests', '__mocks__', '__tests__'] },
    files: {
      include: ['*.js', '*.jsx', '*.ts', '*.jsx', '*.json'],
      exclude: ['*.test.*', '*.stories.*'],
    },
  });

  return hash;
}

async function writeChecksum(checksum, { checksumPath }) {
  const exists = await fs.exists(checksumPath);

  if (!exists) {
    await fs.ensureFile(checksumPath);
  }

  return fs.writeJSON(checksumPath, { checksum }, { spaces: 2 });
}

async function compareChecksum(info) {
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
    await fs.exist(dist);
  } catch (e) {
    return Promise.resolve();
  }

  const info = await Promise.all(
    shell.find('dist').map(async (filePath) => {
      const isDir = await fs.lstat(filePath).isDirectory();
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

    return ignore.reduce((acc, pattern) => {
      return acc || !!filePath.match(pattern);
    }, false);
  });

  if (files.length) {
    shell.rm('-f', ...files);
  }

  return Promise.resolve();
}

const allSettled = async (list) => {
  return Promise.all(
    list.map((l) =>
      l.then(
        () => false,
        (e) => e
      )
    )
  );
};

const run = async (options) => {
  const [src, dist] = await Promise.all([fs.exists('src'), fs.exists('dist')]);

  if (!src) {
    return Promise.resolve();
  }

  const info = await getInfo();
  const { checksum, equal } = await compareChecksum(info);

  const logline = chalk.bold(`${info.package.name}@${info.package.version}`);

  if (!dist || options.watch || !equal) {
    removeDist();

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

run({ watch: isWatchingEnabled, silent: isSilentEnabled }).catch((e) => {
  console.error(e);

  removeDist();

  process.exitCode = 1;
});
