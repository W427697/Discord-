import chalk from 'chalk';
import { transformSnippets } from './transform-snippets-1';
import { convertMdToMdx } from './convert-to-mdx';
import { removecomments } from './removeComments';
import prompts from 'prompts';
import { transformPaths } from './transform-snippets-2';

(async () => {
  console.log(chalk.cyan('---------------------------'));
  console.log(chalk.cyan("-- Let's move to Next.js --"));
  console.log(chalk.cyan('---------------------------'));
  console.log(' ');

  const step1 = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Do you want to convert all md files into mdx files?',
    initial: true,
  });

  if (step1.value === true) convertMdToMdx('./docs');

  const step2 = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Do you want to remove all comments?',
    initial: false,
  });

  if (step2.value === true) removecomments('./docs');

  const step3 = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Do you want to transform snippets?',
    initial: false,
  });

  if (step3.value === true) transformSnippets();

  const step4 = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Do you want to convert snippets paths?',
    initial: false,
  });

  if (step4.value === true) transformPaths();

  console.log(' ');
  console.log('🤍 Done');
})();
