#!/usr/bin/env node

/* eslint-disable global-require */
const terminalSize = require('window-size');
const { checkDependenciesAndRun, spawn } = require('./utils/cli-utils');
const versionFile = require('../lib/cli/src/versions.json');

const storybookPackages = Object.keys(versionFile).map((sbPackage) =>
  sbPackage.replace('@storybook/', '')
);

function run() {
  const prompts = require('prompts');
  const program = require('commander');
  const chalk = require('chalk');
  const log = require('npmlog');

  log.heading = 'storybook';
  const prefix = 'build';
  log.addLevel('aborted', 3001, { fg: 'red', bold: true });

  const packageTasks = storybookPackages
    .map((package) => {
      return {
        name: package,
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
    ...packageTasks,
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

  let selection;
  let watchMode = false;
  if (
    !Object.keys(tasks)
      .map((key) => tasks[key].value)
      .filter(Boolean).length
  ) {
    selection = prompts([
      {
        type: 'toggle',
        name: 'mode',
        message: 'Start in watch mode',
        initial: false,
        active: 'yes',
        inactive: 'no',
      },
      {
        type: 'autocompleteMultiselect',
        message: 'Select the packages to build',
        name: 'todo',
        hint:
          'You can also run directly with package name like `yarn build core`, or `yarn build --all` for all packages!',
        optionsPerPage: terminalSize.height - 3, // 3 lines for extra info
        choices: storybookPackages.map((key) => ({
          value: key,
          title: tasks[key].name || key,
          selected: (tasks[key] && tasks[key].defaultValue) || false,
        })),
      },
    ]).then(({ mode, todo }) => {
      watchMode = mode;
      return todo.map((key) => tasks[key]);
    });
  } else {
    // hits here when running yarn build --packagename
    watchMode = process.argv.includes('--watch');
    selection = Promise.resolve(
      Object.keys(tasks)
        .map((key) => tasks[key])
        .filter((item) => item.name !== 'watch' && item.value === true)
    );
  }

  selection
    .then((list) => {
      if (list.length === 0) {
        log.warn(prefix, 'Nothing to build!');
      } else {
        const packageNames = list
          // filters out watch command if --watch is used
          .map((key) => key.suffix)
          .filter(Boolean);

        let glob =
          packageNames.length > 1
            ? `@storybook/{${packageNames.join(',')}}`
            : `@storybook/${packageNames[0]}`;

        const isAllPackages = process.argv.includes('--all');
        if (isAllPackages) {
          glob = '@storybook/*';

          log.warn(
            'You are building a lot of packages on watch mode. This is an expensive action and might slow your computer down.\nIf this is an issue, run yarn build to filter packages and speed things up!'
          );
        }

        if (watchMode) {
          const runWatchMode = () => {
            const watchTsc = `yarn workspaces foreach --include "${glob}" --parallel --interlaced --jobs 100 --verbose run build:watch-tsc`;
            const watchBabel = `yarn workspaces foreach --include "${glob}" --parallel --interlaced --jobs 100 --verbose run build:watch-babel`;
            const command = `concurrently --kill-others "${watchTsc}" "${watchBabel}"`;

            spawn(command);
          };

          runWatchMode();
        } else {
          const yarnCommand = `yarn workspaces foreach --include "${glob}" --parallel --interlaced --verbose run prepare`;
          spawn(yarnCommand);
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