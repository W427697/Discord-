import { describe, it, expect, vi } from 'vitest';
import { getStorybookCoreVersion } from '@storybook/core/dist/modules/telemetry/index';
import {
  UpgradeStorybookToLowerVersionError,
  UpgradeStorybookToSameVersionError,
} from '@storybook/core/dist/modules/events/errors/server-errors';
import { doUpgrade, getStorybookVersion } from './upgrade';
import type versions from './versions';

vi.mock('@storybook/core/dist/modules/telemetry/index');
vi.mock('./versions', async (importOriginal) => {
  const originalVersions = ((await importOriginal()) as { default: typeof versions }).default;
  return {
    default: Object.keys(originalVersions).reduce(
      (acc, key) => {
        acc[key] = '8.0.0';
        return acc;
      },
      {} as Record<string, string>
    ),
  };
});

describe.each([
  ['│ │ │ ├── @babel/code-frame@7.10.3 deduped', null],
  [
    '│ ├── @storybook/theming@6.0.0-beta.37 extraneous',
    { package: '@storybook/core/dist/modules/theming/index', version: '6.0.0-beta.37' },
  ],
  [
    '├─┬ @storybook/preset-create-react-app@3.1.2',
    { package: '@storybook/preset-create-react-app', version: '3.1.2' },
  ],
  ['│ ├─┬ @storybook/node-logger@5.3.19', { package: '@storybook/node-logger', version: '5.3.19' }],
  [
    'npm ERR! peer dep missing: @storybook/react@>=5.2, required by @storybook/preset-create-react-app@3.1.2',
    null,
  ],
])('getStorybookVersion', (input, output) => {
  it(`${input}`, () => {
    expect(getStorybookVersion(input)).toEqual(output);
  });
});

describe('Upgrade errors', () => {
  it('should throw an error when upgrading to a lower version number', async () => {
    vi.mocked(getStorybookCoreVersion).mockResolvedValue('8.1.0');

    await expect(doUpgrade({} as any)).rejects.toThrowError(UpgradeStorybookToLowerVersionError);
  });
  it('should throw an error when upgrading to the same version number', async () => {
    vi.mocked(getStorybookCoreVersion).mockResolvedValue('8.0.0');

    await expect(doUpgrade({} as any)).rejects.toThrowError(UpgradeStorybookToSameVersionError);
  });
});
