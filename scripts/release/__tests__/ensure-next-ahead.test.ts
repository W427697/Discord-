/* eslint-disable global-require */
/* eslint-disable no-underscore-dangle */
import path from 'path';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';
import { run as ensureNextAhead } from '../ensure-next-ahead';
import * as gitClient_ from '../utils/git-client';
import * as bumpVersion_ from '../version';

vi.mock('../utils/git-client', async () => {
  const y = await import('../utils/git-client');
  return mockDeep(y);
});
vi.mock('../version', async () => {
  const y = await import('../version');
  return mockDeep(y);
});

// eslint-disable-next-line jest/no-mocks-import
vi.mock('fs-extra', () => require('../../../code/__mocks__/fs-extra'));

const fsExtra = require('fs-extra');

const bumpVersion = vi.mocked(bumpVersion_, true);
const gitClient = vi.mocked(gitClient_, true);

vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});

const CODE_PACKAGE_JSON_PATH = path.join(__dirname, '..', '..', '..', 'code', 'package.json');

describe('Ensure next ahead', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    gitClient.git.status.mockResolvedValue({ current: 'next' } as any);
    fsExtra.__setMockFiles({
      [CODE_PACKAGE_JSON_PATH]: JSON.stringify({ version: '2.0.0' }),
    });
  });

  it('should throw when main-version is missing', async () => {
    await expect(ensureNextAhead({})).rejects.toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          "code": "invalid_type",
          "expected": "string",
          "received": "undefined",
          "path": [
            "mainVersion"
          ],
          "message": "Required"
        }
      ]"
    `);
  });

  it('should throw when main-version is not a semver string', async () => {
    await expect(ensureNextAhead({ mainVersion: '200' })).rejects
      .toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          "code": "custom",
          "message": "main-version must be a valid semver version string like '7.4.2'.",
          "path": []
        }
      ]"
    `);
  });

  it('should not bump version when next is already ahead of main', async () => {
    await expect(ensureNextAhead({ mainVersion: '1.0.0' })).resolves.toBeUndefined();
    expect(bumpVersion.run).not.toHaveBeenCalled();
  });

  it('should bump version to 3.1.0-alpha.0 when main is 3.0.0 and next is 2.0.0', async () => {
    await expect(ensureNextAhead({ mainVersion: '3.0.0' })).resolves.toBeUndefined();
    expect(bumpVersion.run).toHaveBeenCalledWith({ exact: '3.1.0-alpha.0' });
  });

  it('should bump version to 2.1.0-alpha.0 when main and next are both 2.0.0', async () => {
    await expect(ensureNextAhead({ mainVersion: '2.0.0' })).resolves.toBeUndefined();
    expect(bumpVersion.run).toHaveBeenCalledWith({ exact: '2.1.0-alpha.0' });
  });

  it('should bump version to 2.1.0-alpha.0 when main is 2.0.0 and and next is 2.0.0-rc.10', async () => {
    fsExtra.__setMockFiles({
      [CODE_PACKAGE_JSON_PATH]: JSON.stringify({ version: '2.0.0-rc.10' }),
    });

    await expect(ensureNextAhead({ mainVersion: '2.0.0' })).resolves.toBeUndefined();
    expect(bumpVersion.run).toHaveBeenCalledWith({ exact: '2.1.0-alpha.0' });
  });
});
