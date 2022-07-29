/* eslint-disable no-underscore-dangle */
import program from 'commander';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { command } from 'execa';
import { temporaryDirectory } from 'tempy';
import { render } from 'ejs';
import { copy, writeFile } from 'fs-extra';
import { fileURLToPath } from 'url';

const logger = console;

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REPROS_DIRECTORY = join(__dirname, '..', '..', '..', 'repros');

interface PublishOptions {
  remote?: string;
  push?: boolean;
  next?: boolean;
  forcePush?: boolean;
}

let tmpFolder: string;

const publish = async (options: PublishOptions) => {
  if (!existsSync(REPROS_DIRECTORY)) {
    throw Error("Can't find repros directory. Did you forget to run generate-repros?");
  }

  const { next: useNextVersion, remote, push, forcePush } = options;

  tmpFolder = temporaryDirectory();

  logger.log(`Created tmp folder: ${tmpFolder}`);

  const scriptPath = __dirname;
  const templatesFolderPath = join(scriptPath, 'templates');
  const gitBranch = useNextVersion ? 'next' : 'main';

  logger.log(`Cloning the repository ${remote} in branch ${gitBranch}`);
  await command(`git clone ${remote} .`, { cwd: tmpFolder });
  await command(`git checkout ${gitBranch}`, { cwd: tmpFolder });

  logger.log(`Moving template files into the repository`);
  await writeFile(join(tmpFolder, 'README.md'), render(join(templatesFolderPath, 'root.ejs'), { data: {} }));
  // await copy(join(templatesFolderPath, gitBranch), tmpFolder, { overwrite: true });

  logger.log(`Moving all the repros into the repository`);
  await copy(join(REPROS_DIRECTORY), tmpFolder);

  try {
    logger.log(`Committing everything to the repository`);

    await command('git add .', { cwd: tmpFolder });

    const currentCommitSHA = command('git rev-parse HEAD');
    await command(
      `git commit -m Update Storybook Examples - ${new Date().toDateString()} - ${currentCommitSHA}`
    );
  } catch (e) {
    logger.log(
      `Git found no changes between previous versions so there is nothing to commit. Skipping publish!`
    );
  }

  logger.info(`
     All the examples were bootstrapped:
        - in ${tmpFolder}
        - using the '${gitBranch}' version of Storybook CLI
        - and committed on the '${gitBranch}' branch of a local Git repository

     Also all the files in the 'templates' folder were copied at the root of the Git repository.
    `);

  try {
    if (remote) {
      await command(`git remote add origin ${remote}`, { cwd: tmpFolder });

      if (push) {
        await command(`git push --set-upstream origin ${gitBranch} ${forcePush ? '--force' : ''}`, {
          cwd: tmpFolder,
        });
        const remoteRepoUrl = `${remote.replace('.git', '')}/tree/${gitBranch}`;
        logger.info(`🚀 Everything was pushed on ${remoteRepoUrl}`);
      } else {
        logger.info(`
       To publish these examples you just need to:
          - push the branch: 'git push --set-upstream origin ${gitBranch}' (you might need '--force' option ;))
      `);
      }
    } else {
      logger.info(`
       To publish these examples you just need to:
          - add a remote Git repository: 'git remote add origin XXXXXXX'
          - push the branch: 'git push --set-upstream origin ${gitBranch}' (you might need '--force' option ;))
      `);
    }
  } catch (e) {
    logger.error(e);
  }
};

program
  .description('Create a reproduction from a set of possible templates')
  .option('--remote <remote>', 'Choose the remote to push the contents to')
  .option('--next', 'Whether to use the next version of Storybook CLI', true)
  .option('--push', 'Whether to push the contents to the remote', false)
  .option('--force-push', 'Whether to force push the changes into the repros repository', false);

program.parse(process.argv);

const options = program.opts() as PublishOptions;

publish(options).catch(async (e) => {
  logger.error(e);

  if (existsSync(tmpFolder)) {
    // logger.log('removing the temporary folder..');
    // await remove(tmpFolder);
  }
  process.exit(1);
});
