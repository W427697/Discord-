/* eslint-disable no-console */
const path = require('path');
const shell = require('shelljs');
const chalk = require('chalk');
const fs = require('fs-extra');

const { hashElement } = require('folder-hash');

const { babelify } = require('./compile-babel');
const { tscfy } = require('./compile-tsc');

async function getInfo() {
  const modulePath = path.resolve('./');
  const packagePath = path.join(modulePath, 'package.json');

  return {
    modulePath,
    packagePath,
    package: await fs.readJSON(packagePath),
  };
}

async function createChecksum() {
  const modulePath = path.resolve('./');

  const { hash } = await hashElement(path.join(modulePath, 'src'), {
    folders: { exclude: ['tests', '__mocks__', '__tests__'] },
    files: {
      include: ['*.js', '*.jsx', '*.ts', '*.jsx', '*.json'],
      exclude: ['*.test.*', '*.stories.*'],
    },
  });

  return hash;
}

async function writeChecksum(checksum, info) {
  const { packagePath, package } = info;

  return fs.writeJSON(packagePath, { ...package, storybook: { checksum } }, { spaces: 2 });
}

async function compareChecksum(info) {
  const { checksum: existing } = info.package.storybook || {};

  const future = await createChecksum();

  return existing === future ? existing : future;
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

const exists = async (location) => {
  try {
    await fs.exists(location);
    return true;
  } catch (e) {
    return false;
  }
};

const run = async (options) => {
  const [src, dist] = await Promise.all([fs.exists('src'), fs.exists('dist')]);

  if (!src) {
    return Promise.resolve();
  }

  const info = await getInfo();
  const checksum = await compareChecksum(info);

  if (
    !dist ||
    options.watch ||
    checksum !== (info.package.storybook && info.package.storybook.checksum)
  ) {
    const checksumTask = writeChecksum(checksum, info);
    const babelTask = babelify(options).then(cleanup);
    const typescriptTask = tscfy(options);

    removeDist();

    await Promise.all([checksumTask, babelTask, typescriptTask]);

    console.log(chalk.gray(`Built: ${chalk.bold(`${info.package.name}@${info.package.version}`)}`));

    return Promise.resolve();
  }
  console.log(chalk.gray(`Skipped: ${chalk.bold(`${info.package.name}@${info.package.version}`)}`));
  return Promise.resolve();
};

const isWatchingEnabled = !!process.argv.find((a) => a === '--watch');

run({ watch: isWatchingEnabled }).catch((e) => {
  console.error(e);
  process.exitCode = 1;
  // throw e;
});
