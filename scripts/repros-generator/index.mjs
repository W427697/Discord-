import { $, cd, chalk } from 'zx';
import { commitEverythingInDirectory, hasLocalChanges } from "./git-helper.mjs";
import { copy, createTmpDir } from './fs-helper.mjs';

export const frameworks = [
  'cra',
  'cra_typescript',
  'react',
  // "react_typescript",
  // "webpack_react",
  // "react_in_yarn_workspace",
  // "angular10",
  // "angular11",
  'angular',
  // "web_components",
  'web_components_typescript',
  'web_components_lit2',
  'vue',
  'vue3',
  'html',
  'preact',
  // "sfcVue",
  'svelte',
];

const logger = console;
const tmpFolder = await createTmpDir();
const currentRepoFolder = await createTmpDir();
const scriptPath = __dirname;
const templatesFolderPath = `${scriptPath}/templates`;

const useNextVersion = argv.next;
// Uncomment to easily run the script locally
// const remote = 'https://github.com/storybookjs/repro-templates.git';
const remote = argv.remote;
const push = argv.push;
const gitBranch = useNextVersion ? 'next' : 'main';
const sbCliVersion = useNextVersion ? 'next' : 'latest';

// First clone the current repo
cd(currentRepoFolder);
await $`git clone ${remote} . --branch ${gitBranch}`

// Then move to another tmp dir and generate repros
cd(tmpFolder);

await copy(`${templatesFolderPath}/${gitBranch}/README.md`, tmpFolder);

for (const framework of frameworks) {
  await $`npx sb@${sbCliVersion} repro --template ${framework} ${framework}`;
  await $`rm -rf ${framework}/.git`;
  await copy(`${templatesFolderPath}/${gitBranch}/.stackblitzrc`, `${tmpFolder}/${framework}`);
}

// Copy new repros into git repository
await $`rsync -av ${tmpFolder}/ ${currentRepoFolder}/ --quiet --exclude .git --exclude "**/node_modules"`

cd(currentRepoFolder);
if(!await hasLocalChanges()) {
  logger.info(chalk.yellow('Nothing to commit, everything was already up-to-date.'));
  logger.info(chalk.green('☑️ Everything is good, exiting with code 0'));
  process.exit();
}

const commitMessage = `Storybook Examples - Update ${new Date().toDateString()}`;
await commitEverythingInDirectory(commitMessage);

logger.info(`
 All the examples were bootstrapped:
    - in ${chalk.blue(tmpFolder)}
    - then move to the current repo in ${chalk.blue(currentRepoFolder)}
    - using the '${chalk.yellow(sbCliVersion)}' version of Storybook CLI
    - and committed on the '${chalk.yellow(gitBranch)}' branch of a local Git repository 
 
 Also, all the files in the 'templates' folder were copied at the root of the Git repository.
`);

try {
  if (remote) {
    if (push) {
      await $`git push --set-upstream origin ${gitBranch}`;
      const remoteRepoUrl = `${remote.replace('.git', '')}/tree/${gitBranch}`;
      logger.info(`🚀 Everything was pushed on ${remoteRepoUrl}`);
    } else {
      logger.info(`
   To publish these examples you just need to:
      - push the branch: 'git push --set-upstream origin ${gitBranch}'
  `);
    }
  } else {
    logger.info(`
   To publish these examples you just need to:
      - add a remote Git repository: 'git remote add origin XXXXXXX'
      - push the branch: 'git push --set-upstream origin ${gitBranch}'
  `);
  }
} catch (e) {
  logger.error(e);
}
