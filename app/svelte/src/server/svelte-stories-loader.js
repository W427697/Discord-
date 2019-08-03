function posixify(file) {
  return file.replace(/[/\\]/g, '/');
}

const extractCsf = require.resolve('../client/extract-csf.js');

const post = `
{
  const { default: extractCsf } = require('${posixify(extractCsf)}');
  module.exports = extractCsf(exports)
}
`;

function svelteStoriesLoader(source, map) {
  const transformedSource = source + post;
  this.callback(null, transformedSource, map);
}

module.exports = svelteStoriesLoader;
