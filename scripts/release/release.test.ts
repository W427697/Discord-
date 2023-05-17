/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */
import path from 'path';
import { run as version } from './version';

// eslint-disable-next-line jest/no-mocks-import
jest.mock('fs-extra', () => require('../../code/__mocks__/fs-extra'));
const fsExtra = require('fs-extra');

jest.mock('../utils/exec');
const { execaCommand } = require('../utils/exec');

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

describe('Version', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw on invalid release type', async () => {
    await expect(() => version({ releaseType: 'invalid' })).rejects.toThrow();
  });

  it('should throw on prerelease identifier with invalid release type', async () => {
    await expect(() => version({ releaseType: 'major', preId: 'alpha' })).rejects.toThrow();
  });

  it.each([
    // prettier-ignore
    { releaseType: 'major', preId: undefined, currentVersion: '1.0.0', expectedVersion: '2.0.0' },
    // prettier-ignore
    { releaseType: 'minor', preId: undefined, currentVersion: '1.0.0', expectedVersion: '1.1.0' },
    // prettier-ignore
    { releaseType: 'patch', preId: undefined, currentVersion: '1.0.0', expectedVersion: '1.0.1' },
    // prettier-ignore
    { releaseType: 'premajor', preId: 'alpha', currentVersion: '1.0.0', expectedVersion: '2.0.0-alpha.0' },
    // prettier-ignore
    { releaseType: 'preminor', preId: 'alpha', currentVersion: '1.0.0', expectedVersion: '1.1.0-alpha.0' },
    // prettier-ignore
    { releaseType: 'prepatch', preId: 'alpha', currentVersion: '1.0.0', expectedVersion: '1.0.1-alpha.0' },
    // prettier-ignore
    { releaseType: 'prerelease', preId: 'alpha', currentVersion: '1.0.0-alpha.5', expectedVersion: '1.0.0-alpha.6' },
    // prettier-ignore
    { releaseType: 'prerelease', preId: 'beta', currentVersion: '1.0.0-alpha.10', expectedVersion: '1.0.0-beta.0' },
    // prettier-ignore
    { releaseType: 'patch', preId: undefined, currentVersion: '1.0.0-rc.10', expectedVersion: '1.0.0' },
  ])(
    'bump with type: $releaseType and pre id $preId, from: $currentVersion, to: $expectedVersion',
    async ({ releaseType, preId, currentVersion, expectedVersion }) => {
      fsExtra.__setMockFiles({
        [CODE_PACKAGE_JSON_PATH]: JSON.stringify({ version: currentVersion }),
        [MANAGER_API_VERSION_PATH]: `export const version = "${currentVersion}";`,
        [VERSIONS_PATH]: `export default { "@junk-temporary-prototypes/addon-a11y": "${currentVersion}" };`,
      });

      await version({ releaseType, preId });

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
