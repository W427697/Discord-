import { describe, afterAll, it, expect, vi } from 'vitest';

import { nodeJsRequirement } from './nodejs-requirement';

vi.mock('node:fs/promises', async () => import('../../../../../__mocks__/fs-extra'));
vi.mock('@ndelangen/fs-extra-unified', async () => import('../../../../../__mocks__/fs-extra'));

const check = async ({ storybookVersion = '7.0.0' }) => {
  return nodeJsRequirement.check({
    storybookVersion,
    packageManager: {} as any,
    mainConfig: {} as any,
  });
};

const originalNodeVersion = process.version;
const mockNodeVersion = (version: string) => {
  Object.defineProperties(process, {
    version: {
      value: version,
    },
  });
};

describe('nodejs-requirement fix', () => {
  afterAll(() => {
    mockNodeVersion(originalNodeVersion);
    vi.restoreAllMocks();
  });

  it('skips when sb <= 7.0.0', async () => {
    mockNodeVersion('14.0.0');
    await expect(check({ storybookVersion: '6.3.2' })).resolves.toBeNull();
  });

  it('skips when node >= 16.0.0', async () => {
    mockNodeVersion('16.0.0');
    await expect(check({})).resolves.toBeNull();
  });

  it('skips when node >= 18.0.0', async () => {
    mockNodeVersion('18.0.0');
    await expect(check({})).resolves.toBeNull();
  });

  it('prompts when node <= 16.0.0', async () => {
    mockNodeVersion('14.0.0');
    await expect(check({})).resolves.toEqual({ nodeVersion: '14.0.0' });
  });
});
