const fs = require('fs-extra');
const path = require('path');

const nextDirName = '_next';
const refFileName = '_next.json';
const versionsFileName = 'versions.json';

function deleteOutputDir(outputDir) {
  return fs.remove(outputDir);
}

function deleteNextOutputDir(outputDir) {
  return fs.remove(path.join(outputDir, nextDirName));
}

function overrideLatestVersion(outputVersionDir, latestVersionDir) {
  return fs.copy(outputVersionDir, latestVersionDir);
}

function updatePackageJson(outputDir, version) {
  const docsJsonPath = path.join(outputDir, 'package.json');

  return fs.readJson(docsJsonPath).then(docsJson => {
    // eslint-disable-next-line no-param-reassign
    docsJson.version = version;
    return fs.writeJson(docsJsonPath, docsJson, { spaces: 2 });
  });
}

function updateVersionsJson(outputDir, newVersion) {
  const versionsFile = path.join(outputDir, versionsFileName);

  return fs.pathExists(versionsFile).then(exists => {
    if (!exists) {
      const versions = { current: newVersion, all: [newVersion] };
      return fs.writeJson(versionsFile, versions, { spaces: 2 });
    }

    return fs.readJson(versionsFile).then(versions => {
      const newVersions = {
        current: newVersion,
        all: versions.all.includes(newVersion) ? versions.all : [...versions.all, newVersion],
      };

      return fs.writeJson(versionsFile, newVersions, { spaces: 2 });
    });
  });
}

function storeFilesReference(outputVersionDir) {
  const nextDir = path.join(outputVersionDir, nextDirName);

  return fs.pathExists(nextDir).then(exists => {
    if (!exists) {
      return Promise.resolve();
    }

    const nextDirFiles = fs.readdirSync(nextDir);
    const refFile = path.join(outputVersionDir, refFileName);
    return fs.writeJson(refFile, nextDirFiles, { spaces: 2 });
  });
}

function deleteOldFiles(outputDir, outputVersionDir) {
  const refFile = path.join(outputVersionDir, refFileName);

  return fs.pathExists(refFile).then(exists => {
    if (!exists) {
      return Promise.resolve();
    }

    return fs.readJson(refFile).then(refJson => {
      refJson.forEach(ref => {
        const nextFileToDelete = path.join(outputDir, nextDirName, ref);
        fs.removeSync(nextFileToDelete);
      });
    });
  });
}

module.exports = {
  deleteOutputDir,
  deleteNextOutputDir,
  overrideLatestVersion,
  updatePackageJson,
  updateVersionsJson,
  storeFilesReference,
  deleteOldFiles,
};
