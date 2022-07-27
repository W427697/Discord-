import { $, cd } from 'zx';
import { commitEverythingInDirectory, initRepo } from './git-helper.mjs';
import { copy, createTmpDir } from './fs-helper.mjs';
import program from 'commander';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { remove } from 'fs-extra';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logger = console;

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

  tmpFolder = await createTmpDir();
  const scriptPath = __dirname;
  const templatesFolderPath = join(scriptPath, 'templates');
  const gitBranch = useNextVersion ? 'next' : 'main';

  cd(tmpFolder);

  await initRepo(gitBranch);
  await copy(`${templatesFolderPath}/${gitBranch}/README.md`, tmpFolder);

  await $`cp -r ${REPROS_DIRECTORY}/* ${tmpFolder}`;

  const commitMessage = `Storybook Examples - ${new Date().toDateString()}`;
  await commitEverythingInDirectory(commitMessage);

  logger.info(`
     All the examples were bootstrapped:
        - in ${tmpFolder}
        - using the '${gitBranch}' version of Storybook CLI
        - and committed on the '${gitBranch}' branch of a local Git repository

     Also all the files in the 'templates' folder were copied at the root of the Git repository.
    `);

  try {
    if (remote) {
      await $`git remote add origin ${remote}`;

      if (push) {
        await $`git push --set-upstream origin ${gitBranch} ${forcePush ? '--force' : ''}`;
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
  console.error(e);

  if (existsSync(tmpFolder)) {
    console.log('removing the temporary folder..');
    await remove(tmpFolder);
  }
  process.exit(1);
});
