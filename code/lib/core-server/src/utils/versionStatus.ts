import type { VersionCheck } from '@junk-temporary-prototypes/types';

export const versionStatus = (versionCheck: VersionCheck) => {
  if (versionCheck.error) return 'error';
  if (versionCheck.cached) return 'cached';
  return 'success';
};
