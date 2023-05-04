import semver from 'semver';

export const isCoercible = (version: string) => {
  try {
    return !!semver.coerce(version);
  } catch (e) {
    return false;
  }
};

export const tryCoerce = (version: string) => {
  try {
    return semver.coerce(version);
  } catch (e) {
    return undefined;
  }
};
