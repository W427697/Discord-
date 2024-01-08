import { describe, expect, test, vi } from 'vitest';
import prompts from 'prompts';
import { detectStorybookVersionFromNodeArgs } from './detect-args-version';
import packageVersions from '../versions';

vi.mock('prompts', () => ({ default: vi.fn() }));

describe('normal', () => {
  test.each([
    [['npx', 'storybook@6.3.0', 'init'], '6.3.0'],
    [['npx', 'sb@6.3.0', 'init'], '6.3.0'],
    [['npx', 'storybook@^8.0.0', 'init'], '^8.0.0'],
    [['npx', 'sb@^8.0.0', 'init'], '^8.0.0'],
    [['npx', 'storybook@next', 'init'], 'next'],
    [['npx', 'sb@next', 'init'], 'next'],
    [['npx', 'storybook@latest', 'init'], 'latest'],
    [['npx', 'sb@latest', 'init'], 'latest'],
    [['npx', '-p', 'sb@latest', 'init'], 'latest'],
  ])('detects storybook version from node args %s', async (args, expected) => {
    await expect(detectStorybookVersionFromNodeArgs(args)).resolves.toBe(expected);
    expect(prompts).not.toHaveBeenCalledOnce();
  });
});

describe('no version', () => {
  test.each([
    [['npx', 'storybook', 'init'], undefined],
    [['npx', 'sb', 'init'], undefined],
  ])('should prompt - return true', async (args, expected) => {
    // @ts-expect-error (how to make this type safe?)
    prompts.mockResolvedValueOnce({ runLatest: true });
    await expect(detectStorybookVersionFromNodeArgs(args)).resolves.toBe(expected);
    expect(prompts).toHaveBeenCalledOnce();
  });

  test.each([
    [['npx', 'storybook', 'init'], undefined],
    [['npx', 'sb', 'init'], undefined],
  ])('should prompt - return false', async (args, expected) => {
    // @ts-expect-error (how to make this type safe?)
    prompts.mockResolvedValueOnce({ runLatest: false });
    await expect(detectStorybookVersionFromNodeArgs(args)).rejects.toThrowError();
    expect(prompts).toHaveBeenCalledOnce();
  });
});

describe('edge case', () => {
  test.each([
    [['node', '../../mono/code/cli/bin/index.js', 'init']],
    [['ts-node', '../../mono/code/cli/src/index.ts', 'init']],
  ])('detects storybook version from node args %s', async (args) => {
    await expect(detectStorybookVersionFromNodeArgs(args)).resolves.toBe(packageVersions.storybook);
    expect(prompts).not.toHaveBeenCalledOnce();
  });
});
