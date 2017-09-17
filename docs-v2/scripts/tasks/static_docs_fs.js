const fs = require('fs-extra');

function deleteOutputDir(outputDir) {
  return fs.remove(outputDir);
}

function deleteNextOutputDir(outputDir) {
  return fs.remove(`${outputDir}/_next`);
}

function overrideLatestVersion(outputVersionDir, latestVersionDir) {
  return fs.copy(outputVersionDir, latestVersionDir);
}

function updatePackageJson(outputDir, version) {
  const docsJsonPath = `${outputDir}/package.json`;

  return fs.readJson(docsJsonPath).then(docsJson => {
    // eslint-disable-next-line no-param-reassign
    docsJson.version = version;
    return fs.writeJson(docsJsonPath, docsJson, { spaces: 2 });
  });
}

module.exports = {
  deleteOutputDir,
  deleteNextOutputDir,
  overrideLatestVersion,
  updatePackageJson,
};
