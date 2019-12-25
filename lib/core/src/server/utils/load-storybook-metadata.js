import semver from 'semver';

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
 * Load a list of storybook packages and their metadata. Cache for performance.
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
