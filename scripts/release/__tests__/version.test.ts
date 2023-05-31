/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */
import path from 'path';
import { run as version } from '../version';

// eslint-disable-next-line jest/no-mocks-import
jest.mock('fs-extra', () => require('../../code/__mocks__/fs-extra'));
const fsExtra = require('fs-extra');

jest.mock('../utils/exec');
const { execaCommand } = require('../utils/exec');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Version', () => {
  const CODE_DIR_PATH = path.join(__dirname, '..', '..', 'code');
  const CODE_PACKAGE_JSON_PATH = path.join(CODE_DIR_PATH, 'package.json');
  const MANAGER_API_VERSION_PATH = path.join(
    CODE_DIR_PATH,
    'lib',
    'manager-api',
    'src',
    'version.ts'
  );
  const VERSIONS_PATH = path.join(CODE_DIR_PATH, 'lib', 'cli', 'src', 'versions.ts');

  it('should throw when release type is invalid', async () => {
    fsExtra.__setMockFiles({
      [CODE_PACKAGE_JSON_PATH]: JSON.stringify({ version: '1.0.0' }),
      [MANAGER_API_VERSION_PATH]: `export const version = "1.0.0";`,
      [VERSIONS_PATH]: `export default { "@junk-temporary-prototypes/addon-a11y": "1.0.0" };`,
    });

    await expect(version({ releaseType: 'invalid' })).rejects.toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          "received": "invalid",
          "code": "invalid_enum_value",
          "options": [
            "major",
            "minor",
            "patch",
            "prerelease",
            "premajor",
            "preminor",
            "prepatch"
          ],
          "path": [
            "releaseType"
          ],
          "message": "Invalid enum value. Expected 'major' | 'minor' | 'patch' | 'prerelease' | 'premajor' | 'preminor' | 'prepatch', received 'invalid'"
        }
      ]"
    `);
  });

  it('should throw when prerelease identifier is combined with non-pre release type', async () => {
    fsExtra.__setMockFiles({
      [CODE_PACKAGE_JSON_PATH]: JSON.stringify({ version: '1.0.0' }),
      [MANAGER_API_VERSION_PATH]: `export const version = "1.0.0";`,
      [VERSIONS_PATH]: `export default { "@junk-temporary-prototypes/addon-a11y": "1.0.0" };`,
    });

    await expect(version({ releaseType: 'major', preId: 'alpha' })).rejects
      .toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          "code": "custom",
          "message": "Using prerelease identifier requires one of release types: premajor, preminor, prepatch, prerelease",
          "path": []
        }
      ]"
    `);
  });

  it('should throw when exact is combined with release type', async () => {
    fsExtra.__setMockFiles({
      [CODE_PACKAGE_JSON_PATH]: JSON.stringify({ version: '1.0.0' }),
      [MANAGER_API_VERSION_PATH]: `export const version = "1.0.0";`,
      [VERSIONS_PATH]: `export default { "@junk-temporary-prototypes/addon-a11y": "1.0.0" };`,
    });

    await expect(version({ releaseType: 'major', exact: '1.0.0' })).rejects
      .toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          "code": "custom",
          "message": "Combining --exact with --release-type is invalid, but having one of them is required",
          "path": []
        }
      ]"
    `);
  });

  it('should throw when exact is invalid semver', async () => {
    fsExtra.__setMockFiles({
      [CODE_PACKAGE_JSON_PATH]: JSON.stringify({ version: '1.0.0' }),
      [MANAGER_API_VERSION_PATH]: `export const version = "1.0.0";`,
      [VERSIONS_PATH]: `export default { "@junk-temporary-prototypes/addon-a11y": "1.0.0" };`,
    });

    await expect(version({ exact: 'not-semver' })).rejects.toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          "code": "custom",
          "message": "--exact version has to be a valid semver string",
          "path": [
            "exact"
          ]
        }
      ]"
    `);
  });

  it.each([
    // prettier-ignore
    { releaseType: 'major', currentVersion: '1.0.0', expectedVersion: '2.0.0' },
    // prettier-ignore
    { releaseType: 'minor', currentVersion: '1.0.0', expectedVersion: '1.1.0' },
    // prettier-ignore
    { releaseType: 'patch', currentVersion: '1.0.0', expectedVersion: '1.0.1' },
    // prettier-ignore
    { releaseType: 'premajor', preId: 'alpha', currentVersion: '1.0.0', expectedVersion: '2.0.0-alpha.0' },
    // prettier-ignore
    { releaseType: 'preminor', preId: 'alpha', currentVersion: '1.0.0', expectedVersion: '1.1.0-alpha.0' },
    // prettier-ignore
    { releaseType: 'prepatch', preId: 'alpha', currentVersion: '1.0.0', expectedVersion: '1.0.1-alpha.0' },
    // prettier-ignore
    { releaseType: 'prerelease', currentVersion: '1.0.0-alpha.5', expectedVersion: '1.0.0-alpha.6' },
    // prettier-ignore
    { releaseType: 'prerelease', preId: 'alpha', currentVersion: '1.0.0-alpha.5', expectedVersion: '1.0.0-alpha.6' },
    // prettier-ignore
    { releaseType: 'prerelease', preId: 'beta', currentVersion: '1.0.0-alpha.10', expectedVersion: '1.0.0-beta.0' },
    // prettier-ignore
    { releaseType: 'major', currentVersion: '1.0.0-rc.10', expectedVersion: '1.0.0' },
    // prettier-ignore
    { releaseType: 'minor', currentVersion: '1.0.0-rc.10', expectedVersion: '1.0.0' },
    // prettier-ignore
    { releaseType: 'patch', currentVersion: '1.0.0-rc.10', expectedVersion: '1.0.0' },
    // prettier-ignore
    { exact: '1.2.0-canary.99', currentVersion: '1.0.0-rc.10', expectedVersion: '1.2.0-canary.99' },
  ])(
    'bump with type: "$releaseType", pre id "$preId" or exact "$exact", from: $currentVersion, to: $expectedVersion',
    async ({ releaseType, preId, exact, currentVersion, expectedVersion }) => {
      fsExtra.__setMockFiles({
        [CODE_PACKAGE_JSON_PATH]: JSON.stringify({ version: currentVersion }),
        [MANAGER_API_VERSION_PATH]: `export const version = "${currentVersion}";`,
        [VERSIONS_PATH]: `export default { "@junk-temporary-prototypes/addon-a11y": "${currentVersion}" };`,
      });

      await version({ releaseType, preId, exact });

      expect(fsExtra.writeJson).toHaveBeenCalledWith(
        CODE_PACKAGE_JSON_PATH,
        { version: expectedVersion },
        { spaces: 2 }
      );
      expect(fsExtra.writeFile).toHaveBeenCalledWith(
        path.join(
          __dirname,
          '..',
          '..',
          'code',
          '.yarn',
          'versions',
          'generated-by-versions-script.yml'
        ),
        expect.stringContaining(expectedVersion)
      );
      expect(execaCommand).toHaveBeenCalledWith('yarn version apply --all', { cwd: CODE_DIR_PATH });
      expect(fsExtra.writeFile).toHaveBeenCalledWith(
        MANAGER_API_VERSION_PATH,
        expect.stringContaining(expectedVersion)
      );
      expect(fsExtra.writeFile).toHaveBeenCalledWith(
        VERSIONS_PATH,
        expect.stringContaining(expectedVersion)
      );
    }
  );
});
