function getNextBuild() {
  return 'next build';
}

function getNextExport(outputDir) {
  return `next export -o ${outputDir}`;
}

module.exports = {
  getNextBuild,
  getNextExport,
};
