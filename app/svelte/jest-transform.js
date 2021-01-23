const svelte = require('svelte/compiler');

const parser = require.resolve('./src/client/parse-stories').replace(/[/\\]/g, '/');

function process(src, filename) {
  const result = svelte.compile(src, {
    format: 'cjs',
    filename,
  });

  const code = result.js ? result.js.code : result.code;

  const z = {
    code: `${code}
    const { default: parser } = require('${parser}');
    module.exports = parser(module.exports, {});
    Object.defineProperty(exports, "__esModule", { value: true });`,
    map: result.js ? result.js.map : result.map,
  };
  return z;
}

exports.process = process;
