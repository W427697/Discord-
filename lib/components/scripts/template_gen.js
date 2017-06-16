const path = require('path');
const shell = require('shelljs');
const chalk = require('chalk');

shell.echo(chalk.gray('\n=> Generate template...'));

const templ = path.join('dist', 'template', 'stories');
const src = path.resolve(__dirname, '../src', 'demo', '*');
const dest = path.resolve(__dirname, '..', templ);

shell.mkdir('-p', dest);

shell.cp(src, dest);

const ls = shell.ls(dest);
ls.map(file => shell.echo(path.join(templ, file)));

shell.echo(chalk.gray('=> Done.'));
