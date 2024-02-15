import chalk from 'chalk';
import { transformSnippets } from './transform-snippets-1';
import { convertMdToMdx } from './convert-to-mdx';
import { removecomments } from './removeComments';
import prompts from 'prompts';
import { transformPaths } from './transform-snippets-2';
import { moveMediaFiles } from './move-assets';
import { removeFiles } from './remove-files';

const docsDir = '../docs';
const assetsDir = `${docsDir}/_assets`;
const oldSnippetsDir = `${docsDir}/snippets`;
const newSnippetsDir = `${docsDir}/_snippets`;

(async () => {
  console.log(chalk.cyan('---------------------------'));
  console.log(chalk.cyan("-- Let's move to Next.js --"));
  console.log(chalk.cyan('---------------------------'));
  console.log(' ');

  const step1 = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Do you want to move all assets into the right folder?',
    initial: false,
  });

  if (step1.value === true) moveMediaFiles(docsDir, assetsDir);

  const step2 = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Do you want to convert all md files into mdx files?',
    initial: false,
  });

  if (step2.value === true) convertMdToMdx(docsDir);

  const step3 = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Do you want to remove all comments?',
    initial: false,
  });

  if (step3.value === true) removecomments(docsDir);

  const step4 = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Do you want to transform snippets?',
    initial: false,
  });

  if (step4.value === true) transformSnippets(oldSnippetsDir, newSnippetsDir);

  const step5 = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Do you want to convert snippets paths?',
    initial: true,
  });

  if (step5.value === true) transformPaths(docsDir);

  const step6 = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Do you want to remove unnecessary files?',
    initial: false,
  });

  if (step6.value === true) removeFiles(docsDir);

  console.log(' ');
  console.log('🤍 Done');
})();
