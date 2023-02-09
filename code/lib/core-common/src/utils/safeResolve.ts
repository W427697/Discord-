import resolveFrom from 'resolve-from';
import findUp from 'find-up';

const pnpAPICache: Record<string, any> = {};

const resolveUsingPnpAPI = (request: string, cwd: string) => {
  const pnpFile = findUp.sync('.pnp.cjs', { cwd, type: 'file' });
  if (pnpFile) {
    pnpAPICache[pnpFile] = pnpAPICache[pnpFile] || require(pnpFile); // eslint-disable-line import/no-dynamic-require, global-require
    const pnpPath = pnpAPICache[pnpFile].resolveRequest(request, cwd);
    if (pnpPath) {
      return pnpPath;
    }
  }
  return undefined;
};

export const safeResolveFrom = (path: string, file: string) => {
  try {
    return resolveFrom(path, file);
  } catch (e) {
    try {
      const fromPnp = resolveUsingPnpAPI(file, path);
      return fromPnp;
    } catch (er) {
      return undefined;
    }
  }
};

export const safeResolve = (file: string) => {
  const cwd = process.cwd();
  try {
    return require.resolve(file);
  } catch (e) {
    try {
      const fromPnp = resolveUsingPnpAPI(file, cwd);
      return fromPnp;
    } catch (er) {
      return undefined;
    }
  }
};
