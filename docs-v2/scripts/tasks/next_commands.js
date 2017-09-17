function getNextBuild() {
  return 'cross-env NODE_ENV=production next build';
}

function getNextExport(outputDir) {
  return `cross-env NODE_ENV=production next export -o ${outputDir}`;
}

module.exports = {
  getNextBuild,
  getNextExport,
};
