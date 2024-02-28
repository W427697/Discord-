import path from 'path';
import readPkgUp from 'read-pkg-up';

export const getPackageJsonPath = (dependency: string) => {
  try {
    return require.resolve(dependency, { paths: [process.cwd()] });
  } catch (err) {
    return require.resolve(path.join(dependency, 'package.json'), {
      paths: [process.cwd()],
    });
  }
};

export class PackageJsonNotFoundError extends Error {
  constructor() {
    super(`No package.json found`);
  }
}

export const getPackageJsonOfDependency = async (dependency: string) => {
  const resolvedPath = getPackageJsonPath(dependency);
  const result = await readPkgUp({ cwd: resolvedPath });

  if (!result?.packageJson) {
    throw new PackageJsonNotFoundError();
  }

  return result.packageJson;
};

export const isPrerelease = (version: string) => {
  return version.includes('-');
};
