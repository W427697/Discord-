const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');

function getCommand(watch) {
  // Compile angular with tsc
  if (process.cwd().includes(path.join('app', 'angular'))) {
    return null;
  }

  const babel = path.join(__dirname, '..', 'node_modules', '.bin', 'babel');

  const args = [
    './src',
    '--out-dir ./dist',
    `--config-file ${path.resolve(__dirname, '../.babelrc.js')}`,
    `--copy-files`,
  ];

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
    args.push('-w');
  }

  return `${babel} ${args.join(' ')}`;
}

const exists = async (location) => {
  try {
    await fs.exists(location);
    return true;
  } catch (e) {
    return false;
  }
};

async function babelify(options = {}) {
  const { watch = false, silent = !watch } = options;
  const [src] = await Promise.all([fs.exists('src')]);

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
