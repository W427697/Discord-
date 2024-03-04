import { describe, expect, test, vi } from 'vitest';
import { add, getVersionSpecifier } from './add';

const MockedConfig = vi.hoisted(() => {
  return {
    appendValueToArray: vi.fn(),
  };
});
const MockedPackageManager = vi.hoisted(() => {
  return {
    retrievePackageJson: vi.fn(() => ({})),
    latestVersion: vi.fn(() => '1.0.0'),
    addDependencies: vi.fn(() => {}),
    type: 'npm',
  };
});
const MockedPostInstall = vi.hoisted(() => {
  return {
    postinstallAddon: vi.fn(),
  };
});

const MockedConsole = {
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
} as any as Console;

vi.mock('@storybook/csf-tools', () => {
  return {
    readConfig: vi.fn(() => MockedConfig),
    writeConfig: vi.fn(),
  };
});
vi.mock('./postinstallAddon', () => {
  return MockedPostInstall;
});

vi.mock('@storybook/core-common', () => {
  return {
    getStorybookInfo: vi.fn(() => ({ mainConfig: {}, configDir: '' })),
    serverRequire: vi.fn(() => ({})),
    JsPackageManagerFactory: {
      getPackageManager: vi.fn(() => MockedPackageManager),
    },
    getCoercedStorybookVersion: vi.fn(() => '8.0.0'),
    versions: {
      'storybook/addon-docs': '^8.0.0',
    },
  };
});

describe('getVersionSpecifier', (it) => {
  test.each([
    ['@storybook/addon-docs', ['@storybook/addon-docs', undefined]],
    ['@storybook/addon-docs@7.0.1', ['@storybook/addon-docs', '7.0.1']],
    ['@storybook/addon-docs@7.0.1-beta.1', ['@storybook/addon-docs', '7.0.1-beta.1']],
    ['@storybook/addon-docs@~7.0.1-beta.1', ['@storybook/addon-docs', '~7.0.1-beta.1']],
    ['@storybook/addon-docs@^7.0.1-beta.1', ['@storybook/addon-docs', '^7.0.1-beta.1']],
    ['@storybook/addon-docs@next', ['@storybook/addon-docs', 'next']],
  ])('%s => %s', (input, expected) => {
    const result = getVersionSpecifier(input);
    expect(result[0]).toEqual(expected[0]);
    expect(result[1]).toEqual(expected[1]);
  });
});

describe('add', () => {
  const testData = [
    { full: 'aa', expected: 'aa@^1.0.0' }, // resolves to the latest version
    { full: 'aa@4', expected: 'aa@^4' },
    { full: 'aa@4.1.0', expected: 'aa@^4.1.0' },
    { full: 'aa@^4', expected: 'aa@^4' },
    { full: 'aa@~4', expected: 'aa@~4' },
    { full: 'aa@4.1.0-alpha.1', expected: 'aa@^4.1.0-alpha.1' },
    { full: 'aa@next', expected: 'aa@next' },

    { full: '@org/aa', expected: '@org/aa@^1.0.0' },
    { full: '@org/aa@4', expected: '@org/aa@^4' },
    { full: '@org/aa@4.1.0', expected: '@org/aa@^4.1.0' },
    { full: '@org/aa@4.1.0-alpha.1', expected: '@org/aa@^4.1.0-alpha.1' },
    { full: '@org/aa@next', expected: '@org/aa@next' },

    { full: 'storybook/addon-docs@~4', expected: 'storybook/addon-docs@~4' },
    { full: 'storybook/addon-docs@next', expected: 'storybook/addon-docs@next' },
    { full: 'storybook/addon-docs', expected: 'storybook/addon-docs@^8.0.0' }, // takes it from the versions file
  ];

  test.each(testData)('$full', async ({ full, expected }) => {
    const [input] = getVersionSpecifier(full);

    await add(full, { packageManager: 'npm', skipPostinstall: true }, MockedConsole);

    expect(MockedConfig.appendValueToArray).toHaveBeenCalledWith(
      expect.arrayContaining(['addons']),
      input
    );

    expect(MockedPackageManager.addDependencies).toHaveBeenCalledWith(
      { installAsDevDependencies: true },
      [expected]
    );
  });
});

describe('add (extra)', () => {
  test('not warning when installing the correct version of storybook', async () => {
    await add(
      'storybook/addon-docs',
      { packageManager: 'npm', skipPostinstall: true },
      MockedConsole
    );

    expect(MockedConsole.warn).not.toHaveBeenCalledWith(
      expect.stringContaining(`is not the same as the version of Storybook you are using.`)
    );
  });
  test('warning when installing a core addon mismatching version of storybook', async () => {
    await add(
      'storybook/addon-docs@2.0.0',
      { packageManager: 'npm', skipPostinstall: true },
      MockedConsole
    );

    expect(MockedConsole.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        `The version of storybook/addon-docs you are installing is not the same as the version of Storybook you are using. This may lead to unexpected behavior.`
      )
    );
  });

  test('postInstall', async () => {
    await add(
      'storybook/addon-docs',
      { packageManager: 'npm', skipPostinstall: false },
      MockedConsole
    );

    expect(MockedPostInstall.postinstallAddon).toHaveBeenCalledWith('storybook/addon-docs', {
      packageManager: 'npm',
    });
  });
});
