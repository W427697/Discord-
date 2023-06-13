const { spawn } = require('child_process');
const { join } = require('path');
const { existsSync } = require('fs');

const checkDependencies = async (force) => {
  const scriptsPath = join(__dirname, '..');
  const codePath = join(__dirname, '..', '..', 'code');

  const tasks = [];

  if (!existsSync(join(scriptsPath, 'node_modules')) || force) {
    tasks.push(
      spawn('yarn install', {
        cwd: scriptsPath,
        shell: true,
        stdio: 'pipe',
      })
    );
  }
  if (!existsSync(join(codePath, 'node_modules')) || force) {
    tasks.push(
      spawn('yarn install', {
        cwd: codePath,
        shell: true,
        stdio: 'pipe',
      })
    );
  }

  if (tasks.length > 0) {
    await Promise.all(
      tasks.map(
        (t) =>
          new Promise((res, rej) => {
            t.on('close', (code) => {
              if (code !== 0) {
                rej();
              } else {
                res();
              }
            });
            t.on('exit', (code) => {
              if (code !== 0) {
                rej();
              } else {
                res();
              }
            });
          })
      )
    ).catch(() => {
      tasks.forEach((t) => t.kill());
      throw new Error('Failed to install dependencies');
    });

    // give the filesystem some time
    await new Promise((res, rej) => {
      setTimeout(res, 1000);
    });
  }
};

module.exports = {
  checkDependencies,
};
