import chalk from 'chalk';
// import { transformSnippets } from './transform-snippets-1';
import { convertMdToMdx } from './convert-to-mdx';
import { removecomments } from './removeComments';
// import { transformPaths } from './transform-snippets-2';

console.log(chalk.cyan('---------------------------'));
console.log(chalk.cyan("-- Let's move to Next.js --"));
console.log(chalk.cyan('---------------------------'));
console.log(' ');

// Convert all .md files to .mdx
console.log(chalk.cyan('Step 1') + ' - Converting all md files into mdx files...');
convertMdToMdx('./docs');

// Remove all comments from .mdx files
console.log(chalk.cyan('Step 2') + ' - Converting all md files into mdx files...');
removecomments('./docs');

// Transform all snippets into single files
console.log(chalk.cyan('Step 3') + ' - Transforming snippets...');
// transformSnippets();

// Converting snippets imports to single paths
console.log(chalk.cyan('Step 4') + ' - Converting snuppets paths...');
// transformPaths();

console.log(' ');
console.log('🤍 Done');
