const { spawn } = require('child_process');

const PACKAGE_MANAGER_TO_COMMAND = {
  npm: ['npx'],
  pnpm: ['pnpm', 'dlx'],
  yarn1: ['npx'],
  yarn2: ['yarn', 'dlx'],
};

const selectPackageManagerCommand = (packageManager) => PACKAGE_MANAGER_TO_COMMAND[packageManager];

const spawnPackageManagerScript = async (packageManager, args) => {
  const [command, ...baseArgs] = selectPackageManagerCommand(packageManager);

  await spawn(command, [...baseArgs, ...args], {
    stdio: 'inherit',
    cwd: process.cwd(),
    shell: true,
  });
};

module.exports = async function postinstall({ packageManager = 'npm' }) {
  try {
    await spawnPackageManagerScript(packageManager, ['@storybook/auto-config', 'themes']);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
