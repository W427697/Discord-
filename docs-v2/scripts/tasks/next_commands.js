function getNextBuild(prefix) {
  return `cross-env NODE_ENV=production ASSET_PREFIX=/${prefix} next build`;
}

function getNextExport(outputDir, prefix) {
  return `cross-env NODE_ENV=production ASSET_PREFIX=/${prefix} next export -o ${outputDir}`;
}

module.exports = {
  getNextBuild,
  getNextExport,
};
