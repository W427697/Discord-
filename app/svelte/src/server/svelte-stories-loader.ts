const extractCsf = require.resolve('../client/extract-csf.js');

const post = `
{
  const { default: extractCsf } = require('${posixify(extractCsf)}');
  module.exports = extractCsf(exports)
}
`;

function posixify(file: string) {
  return file.replace(/[/\\]/g, '/');
}

function svelteStoriesLoader(code: string, map: any) {
  const transformedCode = code + post;
  return transformedCode;
}

export default svelteStoriesLoader;
