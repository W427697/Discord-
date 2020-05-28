import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import shell from 'shelljs';

function getCommand(watch: boolean) {
  // Compile angular with tsc
  if (process.cwd().includes(path.join('app', 'angular'))) {
    return null;
  }

  const babel = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'babel');

  const ignored = glob.sync('./src/**/*.@(d|spec|test|stories).@(js|jsx|ts|tsx)');

  const args = [
    '"./src"',
    '--out-dir "./dist"',
    `--config-file ${path.resolve(__dirname, '../../.babelrc.js')}`,
    `--copy-files`,
    `--no-copy-ignored`,
  ];

  if (ignored && ignored.length) {
    // the ignore glob doesn't seem to be working at all
    args.push(
      `--ignore ${glob
        .sync('./src/**/*.@(d|spec|test|stories).@(js|jsx|ts|tsx)')
        .map((n) => `"${n}"`)
        .join(',')}`
    );
  }

  /*
   * angular needs to be compiled with tsc; a compilation with babel is possible but throws
   * runtime errors because of the the babel decorators plugin
   * Only transpile .js and let tsc do the job for .ts files
   */
  if (process.cwd().includes(path.join('addons', 'storyshots'))) {
    args.push(`--extensions ".js"`);
  } else {
    args.push(`--extensions ".js,.jsx,.ts,.tsx"`);
  }

  if (watch) {
    args.push('-w --skip-initial-build');
  }

  return `${babel} ${args.join(' ')}`;
}

interface Options {
  watch?: boolean;
  silent?: boolean;
}

async function babelify(options: Options = {}) {
  const { watch = false, silent = !watch } = options;
  const src = await fs.pathExists('src');

  if (!src) {
    return Promise.resolve();
  }

  const command = getCommand(watch);

  if (command) {
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
  return Promise.resolve();
}

module.exports = {
  babelify,
};
