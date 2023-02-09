import resolveFrom from 'resolve-from';
import findUp from 'find-up';
import { resolveExports } from 'resolve-pkg-maps';
import { readJSONSync } from 'fs-extra';
import { dirname, join, relative } from 'path';

const pnpAPICache: Record<string, any> = {};
const pnpFileCache: Record<string, any> = {};

const resolveUsingPnpAPI = (request: string, cwd: string) => {
  pnpFileCache[cwd] = pnpFileCache[cwd] || findUp.sync('.pnp.cjs', { cwd, type: 'file' });
  const pnpFile = pnpFileCache[cwd];
  if (pnpFile) {
    pnpAPICache[pnpFile] = pnpAPICache[pnpFile] || require(pnpFile); // eslint-disable-line import/no-dynamic-require, global-require
    const pnpPath = pnpAPICache[pnpFile].resolveRequest(request, cwd);
    if (pnpPath) {
      return pnpPath;
    }
  }
  return undefined;
};

export const safeResolveFrom = (directory: string, request: string) => {
  try {
    return require.resolve(request, { paths: [directory, process.cwd()] });
  } catch (e) {
    //
  }

  try {
    return resolveFrom(directory, request);
  } catch (e) {
    //
  }

  try {
    return require.resolve(request);
  } catch (e) {
    //
  }

  try {
    const pkgLocation = findUp.sync('package.json', { cwd: directory });
    if (!pkgLocation) {
      throw new Error('no package.json found');
    }

    const req = relative(pkgLocation, request).slice(1);
    const [out] = resolveExports(readJSONSync(pkgLocation).exports, req.slice(2), [
      'node',
      'require',
      'default',
    ]);

    return join(dirname(pkgLocation), out);
  } catch (e) {
    //
  }

  try {
    return resolveUsingPnpAPI(request, directory);
  } catch (e) {
    //
  }
  return request;
};

export const safeResolve = (request: string) => {
  const cwd = process.cwd();
  try {
    return require.resolve(request);
  } catch (e) {
    //
  }

  try {
    const pkgLocation = findUp.sync('package.json', { cwd: request });
    if (!pkgLocation) {
      throw new Error('no package.json found');
    }

    const req = relative(pkgLocation, request).slice(1);
    const [out] = resolveExports(readJSONSync(pkgLocation).exports, req.slice(2), [
      'node',
      'require',
      'default',
    ]);

    return join(dirname(pkgLocation), out);
  } catch (e) {
    //
  }

  try {
    const fromPnp = resolveUsingPnpAPI(request, cwd);
    return fromPnp;
  } catch (er) {
    //
  }
  return request;
};
