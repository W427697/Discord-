const svelte = require('svelte/compiler');

const esInterop = '\nObject.defineProperty(exports, "__esModule", { value: true });';

function process(src, filename) {
  const result = svelte.compile(src, {
    format: 'cjs',
    filename,
  });

  const code = (result.js ? result.js.code : result.code) + esInterop;

  return {
    code,
    map: result.js ? result.js.map : result.map,
  };
}

exports.process = process;
