import process from 'process';
import { getStorybookConfigPath } from '../paths';
import { setupFs, teardown, testDir } from '../__helper__/mock-fs';

const spy = jest.spyOn(process, 'cwd');
// eslint-disable-next-line global-require
jest.mock('fs', () => new (require('metro-memory-fs'))());

const setup = (cwd, files) => {
  spy.mockReturnValue(cwd);

  setupFs(files);
};

describe('getStorybookConfigPath', () => {
  afterEach(teardown);

  it('should work based on current working directory', async () => {
    setup(`/${testDir}/git/package/dir`, {
      [`/${testDir}/git/.git`]: {},
      [`/${testDir}/git/package/package.json`]: '{}',
      [`/${testDir}/git/package/dir`]: {},
      [`/${testDir}/git/package/dir/storybook.config.js`]: '""',
    });

    const result = await getStorybookConfigPath();

    expect(result).toEqual(`/${testDir}/git/package/dir/storybook.config.js`);
  });

  it('should work based on package directory', async () => {
    setup(`/${testDir}/git/package/dir`, {
      [`/${testDir}/git/.git`]: {},
      [`/${testDir}/git/package/package.json`]: '{}',
      [`/${testDir}/git/package/storybook.config.js`]: '""',
      [`/${testDir}/git/package/dir`]: {},
    });

    const result = await getStorybookConfigPath();

    expect(result).toEqual(`/${testDir}/git/package/storybook.config.js`);
  });

  it('should work based on git directory', async () => {
    setup(`/${testDir}/git/package/dir`, {
      [`/${testDir}/git/.git`]: {},
      [`/${testDir}/git/storybook.config.js`]: '""',
      [`/${testDir}/git/package/package.json`]: '{}',
      [`/${testDir}/git/package/dir`]: {},
    });

    const result = await getStorybookConfigPath();

    expect(result).toEqual(`/${testDir}/git/storybook.config.js`);
  });
});
