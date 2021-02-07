#!/usr/bin/env node
const chalk = require('chalk');

/**
 * This is a temporary script to ensure backward compatibility of `yarn test --core`.
 * It should be removed in a few weeks/months when Storybook active maintainers
 * will be used to use `yarn test` (and `test-puppeteer`) instead.
 */
const logger = console;

const isStorybookCustomOption = (arg) => arg === '--core' || arg === '--puppeteer';

if (process.argv.find((arg) => isStorybookCustomOption(arg))) {
  logger.log(
    chalk.red`⚠️ The '--core' option isn't needed anymore and will be removed soon, all the options provided to 'yarn test' are now forwarded to Jest directly.`
  );
  logger.log(
    chalk.yellow`📝 Also, the '--puppeteer' option is now a standalone NPM script: 'yarn test-puppeteer'`
  );
}

// Remove `--core` and `--puppeteer` args
process.argv = process.argv.filter((arg) => !isStorybookCustomOption(arg));

// Calling jest runner
require('jest-cli/bin/jest');
