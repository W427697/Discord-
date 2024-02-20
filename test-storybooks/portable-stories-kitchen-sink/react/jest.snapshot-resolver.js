const path = require('path');

module.exports = {
  // Resolves the snapshot file path based on the test file path
  resolveSnapshotPath: (testPath, snapshotExtension) =>
    testPath.replace('__tests__', '__jest_snapshots__') + snapshotExtension,

  // Resolves the test file path based on the snapshot file path
  resolveTestPath: (snapshotFilePath, snapshotExtension) =>
    snapshotFilePath.replace('__jest_snapshots__', '__tests__').slice(0, -snapshotExtension.length),

  testPathForConsistencyCheck: 'some/example.test.js',
};