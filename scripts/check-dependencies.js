#!/usr/bin/env node

const { spawn } = require('child_process');
const { join } = require('path');
const { existsSync } = require('fs');

const checkDependencies = async () => {
  const scriptsPath = join(__dirname);
  const codePath = join(__dirname, '..', 'code');

  if (!existsSync(join(scriptsPath, 'node_modules'))) {
    console.log('installing script dependencies');

    await spawn('pnpm', ['install'], {
      cwd: scriptsPath,
      stdio: ['inherit', 'inherit', 'inherit'],
    });
  }

  if (!existsSync(join(codePath, 'node_modules'))) {
    console.log('installing code dependencies');

    await spawn('yarn', ['install'], {
      cwd: codePath,
      stdio: ['inherit', 'inherit', 'inherit'],
    });
  }

  // give the filesystem some time
  await new Promise((res, rej) => {
    setTimeout(res, 1000);
  });
};

module.exports = {
  checkDependencies,
};

checkDependencies().catch((e) => {
  console.error(e);
  process.exit(1);
});
