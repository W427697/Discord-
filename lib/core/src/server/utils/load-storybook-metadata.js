import semver from 'semver';
import Cache from 'file-system-cache';
import findCacheDir from 'find-cache-dir';
import findUp from 'find-up';
import fs from 'fs-extra';

/**
 * Load storybook metadata for a single package, using the cached value if present
 */
export const loadPackageMetadata = async (packageName, versionRange, { getPackageJson, cache }) => {
  const cachedValue = cache[packageName];
  if (cachedValue && cachedValue.versionRange === versionRange && semver.coerce(versionRange)) {
    return cachedValue;
  }
  const packageJson = await getPackageJson(packageName);
  const { version, storybook } = packageJson;
  return { versionRange, version, storybook };
};

/**
 * Load a list of storybook packages and their metadata
 */
export const loadStorybookMetadata = async (packageJson, options) => {
  const storybookPackages = {};
  const loadPackage = async ([packageName, packageVersion]) => {
    const metadata = await loadPackageMetadata(packageName, packageVersion, options);
    storybookPackages[packageName] = metadata;
  };
  await Promise.all(Object.entries(packageJson.dependencies || {}).map(loadPackage));
  await Promise.all(Object.entries(packageJson.devDependencies || {}).map(loadPackage));
  return storybookPackages;
};

/**
 * Load a list of storybook packages and their metadata. Cache for performance.
 */
export async function cachedStorybookMetadata() {
  const cacheDir = findCacheDir({ name: 'storybook' });
  const cache = Cache({
    basePath: cacheDir,
    ns: 'storybook', // Optional. A grouping namespace for items.
  });

  const packagePath = await findUp('package.json');
  if (!packagePath) {
    throw new Error('No package.json');
  }
  const packageJson = JSON.parse(await fs.readFile(packagePath, 'utf-8'));
  const metadataCache = await cache.get('storybookMetadata', {});
  const storybookMetadata = await loadStorybookMetadata(packageJson, {
    cache: metadataCache,
    getPackageJson: async packageName => {
      const packageFile = require.resolve(`${packageName}/package.json`);
      return JSON.parse(await fs.readFile(packageFile, 'utf8'));
    },
  });
  await cache.set('storybookMetadata', storybookMetadata);
  return storybookMetadata;
}
