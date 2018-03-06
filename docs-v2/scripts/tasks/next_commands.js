const promisifyProcess = require('./promisifyProcess');

function build() {
  return promisifyProcess('cross-env NODE_ENV=production next build', 'next-build');
}

function staticExport(outputDir) {
  return promisifyProcess(
    `cross-env NODE_ENV=production next export -o ${outputDir}`,
    'next-export'
  );
}

module.exports = {
  build,
  staticExport,
};
