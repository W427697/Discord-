/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */
import path from 'path';
import { run as version } from './version';

// eslint-disable-next-line jest/no-mocks-import
jest.mock('fs-extra', () => require('../../code/__mocks__/fs-extra'));

const codePkgJsonPath = path.join(__dirname, '..', '..', 'code', 'package.json');

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

  it('bumps minor version in code package.json', async () => {
    const fsExtra = require('fs-extra');
    fsExtra.__setMockFiles({
      [codePkgJsonPath]: JSON.stringify({ version: '1.0.0' }),
    });

    await version({ releaseType: 'minor' });

    expect(fsExtra.writeJson).toHaveBeenCalledWith(
      codePkgJsonPath,
      { version: '1.1.0' },
      { spaces: 2 }
    );
  });

  it('bumps alpha prerelease version in code package.json', async () => {
    const fsExtra = require('fs-extra');
    fsExtra.__setMockFiles({
      [codePkgJsonPath]: JSON.stringify({ version: '1.0.0-alpha.5' }),
    });

    await version({ releaseType: 'prerelease' });

    expect(fsExtra.writeJson).toHaveBeenCalledWith(
      codePkgJsonPath,
      { version: '1.0.0-alpha.6' },
      { spaces: 2 }
    );
  });

  it('bumps alpha to beta prerelease version in code package.json', async () => {
    const fsExtra = require('fs-extra');
    fsExtra.__setMockFiles({
      [codePkgJsonPath]: JSON.stringify({ version: '1.0.0-alpha.5' }),
    });

    await version({ releaseType: 'prerelease', preId: 'beta' });

    expect(fsExtra.writeJson).toHaveBeenCalledWith(
      codePkgJsonPath,
      { version: '1.0.0-beta.0' },
      { spaces: 2 }
    );
  });

  it('bumps rc to stable version in code package.json', async () => {
    const fsExtra = require('fs-extra');
    fsExtra.__setMockFiles({
      [codePkgJsonPath]: JSON.stringify({ version: '1.0.0-rc.5' }),
    });

    await version({ releaseType: 'patch' });

    expect(fsExtra.writeJson).toHaveBeenCalledWith(
      codePkgJsonPath,
      { version: '1.0.0' },
      { spaces: 2 }
    );
  });
});
