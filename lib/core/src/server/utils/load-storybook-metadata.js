/**
 * Load storybook metadata for a single package, using the cached value if present
 */
export const loadPackageMetadata = async (
  packageName,
  packageVersion,
  { getPackageJson, cache }
) => {
  const cachedValue = cache[packageName];
  if (cachedValue && cachedValue.version === packageVersion) {
    return cachedValue;
  }
  const packageJson = await getPackageJson(packageName);
  const { version, storybook } = packageJson;
  return { version, storybook };
};

/**
 * Load a list of storybook packages and their metadata. Cache for performance.
 */
export const loadStorybookMetadata = async (packageJson, { getPackageJson, cache }) => {
  const storybookPackages = {};
  const loadPackage = async ([packageName, packageVersion]) => {
    const metadata = await loadPackageMetadata(packageName, packageVersion, {
      getPackageJson,
      cache,
    });
    storybookPackages[packageName] = metadata;
  };
  await Promise.all(Object.entries(packageJson.dependencies || {}).map(loadPackage));
  await Promise.all(Object.entries(packageJson.devDependencies || {}).map(loadPackage));
  return storybookPackages;
};
