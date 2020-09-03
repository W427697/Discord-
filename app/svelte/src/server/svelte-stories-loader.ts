function posixify(file: string) {
  return file.replace(/[/\\]/g, '/');
}

const extractCsf = require.resolve('../client/extract-csf.js');

const post = `
{
  const { default: extractCsf } = require('${posixify(extractCsf)}');
  module.exports = extractCsf(exports)
}
`;

// intermediate transform function, guaranteed to be synchronous: used in
// svelte transform for jest storyshots
function transform({ code, map }: any) {
  const transformedCode = code + post;
  return {
    code: transformedCode,
    map,
  };
}

function svelteStoriesLoader(code: string, map: any) {
  const transformed = transform({ code, map });
  this.callback(null, transformed.code, transformed.map);
}

module.exports = Object.assign(svelteStoriesLoader, {
  transform,
});
