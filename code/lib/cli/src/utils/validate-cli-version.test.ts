import { describe, expect, test } from 'vitest';
import { validateCLIVersioningFromProcessArgs } from './validate-cli-version';

describe('success case', () => {
  test.each([
    [['npx', 'storybook@6.3.0', 'init'], true],
    [['npx', 'sb@6.3.0', 'init'], true],
    [['npx', 'storybook@^8.0.0', 'init'], true],
    [['npx', 'sb@^8.0.0', 'init'], true],
    [['npx', 'storybook@next', 'init'], true],
    [['npx', 'sb@next', 'init'], true],
    [['npx', 'storybook@latest', 'init'], true],
    [['npx', 'sb@latest', 'init'], true],
    [['npx', '-p', '@storybook/cli@latest', 'sb', 'init'], true],
  ])('%s', async (args, expected) => {
    expect(validateCLIVersioningFromProcessArgs(args)).toBe(expected);
  });
});

describe('fail case', () => {
  test.each([
    [['npx', 'storybook', 'init'], false],
    [['npx', 'sb', 'init'], false],
    [['npx', '-p', '@storybook/cli', 'sb', 'init'], false],
  ])('%s', async (args, expected) => {
    await expect(validateCLIVersioningFromProcessArgs(args)).toBe(expected);
  });
});

describe('direct invocation', () => {
  test.each([
    [['node', '../../mono/code/cli/bin/index.js', 'init'], true],
    [['ts-node', '../../mono/code/cli/src/index.ts', 'init'], true],
  ])('%s', async (args, expected) => {
    await expect(validateCLIVersioningFromProcessArgs(args)).toBe(expected);
  });
});
