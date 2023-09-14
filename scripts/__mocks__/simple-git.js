import { vi } from 'vitest';
/* eslint-disable no-underscore-dangle */
const mod = vi.createMockFromModule('simple-git');

mod.__getRemotes = vi
  .fn()
  .mockReturnValue([{ name: 'origin', refs: { fetch: 'origin', push: 'origin' } }]);
mod.__fetch = vi.fn();
mod.__revparse = vi.fn().mockResolvedValue('mockedGitCommitHash');

mod.simpleGit = () => {
  return {
    getRemotes: mod.__getRemotes,
    fetch: mod.__fetch,
    revparse: mod.__revparse,
  };
};

module.exports = mod;
