#!/usr/bin/env node

/* eslint-disable global-require */
const terminalSize = require('window-size');
const { checkDependenciesAndRun, spawn } = require('./utils/cli-utils');

const getStorybookPackages = () => {
  const listCommand = spawn(`lerna list`, {
    stdio: 'pipe',
  });

  const packages = listCommand.output
    .toString()
    .match(/@storybook\/(.)*/g)
    .sort();

  return packages;
};

const flags = (list) => list.filter(Boolean).join(' ');

const buildFlags = process.env.CI ? [] : ['--stream', '--no-prefix'];
const watchFlags = ['--parallel'];

function run() {
  const inquirer = require('inquirer');
  const program = require('commander');
  const chalk = require('chalk');
  const log = require('npmlog');

  log.heading = 'storybook';
  const prefix = 'build';
  log.addLevel('aborted', 3001, { fg: 'red', bold: true });

  const packages = getStorybookPackages();
  const packageTasks = packages
    .map((package) => {
      return {
        name: package,
        isPackage: true,
        suffix: package.replace('@storybook/', ''),
        defaultValue: false,
        helpText: `build only the ${package} package`,
      };
    })
    .reduce((acc, next) => {
      acc[next.name] = next;
      return acc;
    }, {});

  const tasks = {
    watch: {
      name: `watch`,
      defaultValue: false,
      suffix: '--watch',
      helpText: 'build on watch mode',
    },
    regen: {
      name: `regen`,
      defaultValue: false,
      suffix: '--regen',
      helpText: 'rebuild everything from scratch',
    },
    ...packageTasks,
  };

  const groups = {
    'mode (leave unselected if you just want to build)': ['watch', 'regen'],
    packages,
  };

  const main = program.version('5.0.0').option('--all', `build everything ${chalk.gray('(all)')}`);

  Object.keys(tasks)
    .reduce((acc, key) => acc.option(tasks[key].suffix, tasks[key].helpText), main)
    .parse(process.argv);

  Object.keys(tasks).forEach((key) => {
    // checks if a flag is passed e.g. yarn build --@storybook/addon-docs --watch
    const containsFlag = program.rawArgs.includes(tasks[key].suffix);
    tasks[key].value = containsFlag || program.all;
  });

  const createSeparator = (input) => `- ${input}${' ---------'.substr(0, 12)}`;

  const choices = Object.values(groups)
    .map((l) =>
      l.map((key) => ({
        name: (tasks[key] && tasks[key].name) || key,
        checked: (tasks[key] && tasks[key].defaultValue) || false,
      }))
    )
    .reduce(
      (acc, i, k) =>
        acc.concat(new inquirer.Separator(createSeparator(Object.keys(groups)[k]))).concat(i),
      []
    );

  let selection;
  let watchMode = false;
  let regenMode = false;
  if (
    !Object.keys(tasks)
      .map((key) => tasks[key].value)
      .filter(Boolean).length
  ) {
    const ui = new inquirer.ui.BottomBar();
    ui.log.write(
      chalk.yellow(
        'You can also run directly with package name like `yarn build core`, or `yarn build --all` for all packages!'
      )
    );

    selection = inquirer
      .prompt([
        {
          type: 'checkbox',
          message: 'Select the packages to build',
          name: 'todo',
          pageSize: terminalSize.height - 3, // 3 lines for extra info
          choices,
        },
      ])
      .then(({ todo }) => {
        watchMode = todo.includes('watch');
        regenMode = todo.includes('regen');
        return todo
          .filter((name) => name !== 'watch' || name !== 'regen') // remove watch option as it served its purpose
          .map((name) => tasks[Object.keys(tasks).find((i) => tasks[i].name === name)]);
      });
  } else {
    // hits here when running yarn build --packagename
    watchMode = process.argv.includes('--watch');
    regenMode = process.argv.includes('--regen');
    selection = Promise.resolve(
      Object.keys(tasks)
        .map((key) => tasks[key])
        .filter((item) => item.value === true)
    );
  }

  selection
    .then(async (list) => {
      if (list.length === 0) {
        log.warn(prefix, 'Nothing to build!');
      } else {
        const packageNames = list
          // filters out watch command if --watch is used
          .filter((key) => key.name !== 'watch' && key.name !== 'regen')
          .map((key) => key.suffix)
          .filter(Boolean);

        const isAllPackages = process.argv.includes('--all');
        const scopes = isAllPackages
          ? ['--scope @storybook/*']
          : packageNames.map((n) => `--scope @storybook/${n}`);

        const extraFlags = [regenMode ? '--regen' : false];

        if (program.all) {
          extraFlags.push('--tsdowngrade');
        }

        let confirmWatch = true;

        if (watchMode) {
          if (packageNames.length > 5) {
            ({ confirmWatch } = await inquirer.prompt([
              {
                type: 'confirm',
                message:
                  'You selected a lot of packages on watch mode. This is a very expensive action and might slow your computer down. Do you want to continue?',
                name: 'confirmWatch',
              },
            ]));
          }
        }

        spawn(`lerna run prepare ${flags([...buildFlags, ...scopes])} -- ${flags(extraFlags)}`);

        if (watchMode && confirmWatch) {
          // run everything in parallel watch mode
          spawn(`lerna run prepare ${flags([...watchFlags, ...scopes])} -- --watch`);
        }

        process.stdout.write('\x07');
      }
    })
    .catch((e) => {
      log.aborted(prefix, chalk.red(e.message));
      log.silly(prefix, e);
      process.exit(1);
    });
}

checkDependenciesAndRun(run);
