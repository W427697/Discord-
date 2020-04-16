import { spawn, exec } from 'child_process';
import chalk from 'chalk';
import program from 'commander';
import detectFreePort from 'detect-port';
import dedent from 'ts-dedent';
import fs from 'fs';
import nodeCleanup from 'node-cleanup';

import { listOfPackages } from './utils/list-packages';

program
  .option('-o, --open', 'keep process open')
  .option('-p, --publish', 'should publish packages');

program.parse(process.argv);

const logger = console;

const freePort = (port) => detectFreePort(port);

let verdaccioProcess;

const startVerdaccio = (port) => {
  let resolved = false;
  return Promise.race([
    new Promise((res) => {
      verdaccioProcess = spawn('npx', [
        'verdaccio@4.0.1',
        '-c',
        'scripts/verdaccio.yaml',
        '-l',
        port,
      ]);
      verdaccioProcess.stdout.on('data', (data) => {
        if (!resolved && data && data.toString().match(/http address/)) {
          const [url] = data.toString().match(/(http:.*\d\/)/);
          res(url);
          resolved = true;
        }
        fs.appendFile('verdaccio.log', data, (err) => {
          if (err) {
            throw err;
          }
        });
      });
    }),
    new Promise((res, rej) => {
      setTimeout(() => {
        if (!resolved) {
          rej(new Error(`TIMEOUT - verdaccio didn't start within 60s`));

          resolved = true;

          verdaccioProcess.kill();
        }
      }, 60000);
    }),
  ]);
};
const registryUrl = (command, url) =>
  new Promise((res, rej) => {
    const args = url ? ['config', 'set', 'registry', url] : ['config', 'get', 'registry'];
    exec(`${command} ${args.join(' ')}`, (e, stdout) => {
      if (e) {
        rej(e);
      } else {
        res(url || stdout.toString().trim());
      }
    });
  });

const registriesUrl = (yarnUrl, npmUrl) =>
  Promise.all([registryUrl('yarn', yarnUrl), registryUrl('npm', npmUrl || yarnUrl)]);

nodeCleanup(() => {
  try {
    verdaccioProcess.kill();
  } catch (e) {
    //
  }
});

const applyRegistriesUrl = (yarnUrl, npmUrl, originalYarnUrl, originalNpmUrl) => {
  logger.log(`↪️  changing system config`);
  nodeCleanup(() => {
    registriesUrl(originalYarnUrl, originalNpmUrl);

    logger.log(dedent`
      Your registry config has been restored from:
      npm: ${npmUrl} to ${originalNpmUrl} 
      yarn: ${yarnUrl} to ${originalYarnUrl} 
    `);
  });

  return registriesUrl(yarnUrl, npmUrl);
};

const addUser = (url) =>
  new Promise((res, rej) => {
    logger.log(`👤 add temp user to verdaccio`);

    exec(`npx npm-cli-adduser -r "${url}" -a -u user -p password -e user@example.com`, (e) => {
      if (e) {
        rej(e);
      } else {
        res();
      }
    });
  });

const currentVersion = async () => {
  const { version } = (await import('../lerna.json')).default;
  return version;
};

const publish = (packages, url) =>
  packages.reduce((acc, { name, location }) => {
    return acc.then(() => {
      return new Promise((res, rej) => {
        logger.log(`🛫 publishing ${name} (${location})`);
        const command = `cd ${location} && npm publish --registry ${url} --force --access restricted`;
        exec(command, (e) => {
          if (e) {
            rej(e);
          } else {
            logger.log(`🛬 successful publish of ${name}!`);
            res();
          }
        });
      });
    });
  }, Promise.resolve());

const run = async () => {
  const port = await freePort(4873);
  logger.log(`🌏 found a open port: ${port}`);

  logger.log(`🔖 reading current registry settings`);
  let [originalYarnRegistryUrl, originalNpmRegistryUrl] = await registriesUrl();
  if (
    originalYarnRegistryUrl.includes('localhost') ||
    originalNpmRegistryUrl.includes('localhost')
  ) {
    originalYarnRegistryUrl = 'https://registry.npmjs.org/';
    originalNpmRegistryUrl = 'https://registry.npmjs.org/';
  }

  logger.log(`📐 reading version of storybook`);
  logger.log(`🚛 listing storybook packages`);
  logger.log(`🎬 starting verdaccio (this takes ±20 seconds, so be patient)`);

  const [shouldOverwrite, verdaccioUrl, packages, version] = await Promise.all([
    startVerdaccio(port),
    listOfPackages(),
    currentVersion(),
  ]);

  logger.log(`🌿 verdaccio running on ${verdaccioUrl}`);

  if (shouldOverwrite) {
    logger.log(dedent`
      You have chosen to change your system's default registry url. If this process fails for some reason and doesn't exit correctly, you may be stuck with a npm/yarn config that's broken.
      To fix this you can revert back to the registry urls you had before by running:

      > npm config set registry ${originalNpmRegistryUrl}
      > yarn config set registry ${originalYarnRegistryUrl}

      You can now use regular install procedure anywhere on your machine and the storybook packages will be installed from this local registry

      The registry url is: ${verdaccioUrl}
    `);
  } else {
    logger.log(dedent`
      You have chosen to NOT change your system's default registry url. 

      The registry is running locally, but you'll need to add a npm/yarn config file in your project in that points to the registry.
      Here's a documentation for npm: https://docs.npmjs.com/files/npmrc
      Yarn is able to read this file as well

      The registry url is: ${verdaccioUrl}
    `);
  }

  if (shouldOverwrite) {
    await applyRegistriesUrl(
      verdaccioUrl,
      verdaccioUrl,
      originalYarnRegistryUrl,
      originalNpmRegistryUrl
    );
  }

  await addUser(verdaccioUrl);

  logger.log(`📦 found ${packages.length} storybook packages at version ${chalk.blue(version)}`);

  if (program.publish) {
    await publish(packages, verdaccioUrl);
  }

  if (!program.open) {
    verdaccioProcess.kill();
  }
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
