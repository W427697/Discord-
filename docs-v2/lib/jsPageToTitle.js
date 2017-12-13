const Walker = require('node-source-walk');

/**
 * Extracts the dependencies of the supplied es6 module
 *
 * @param  {String|Object} src - File's content or AST
 * @return {String[]}
 */
module.exports = function getTitleFromJsPage(src) {
  const walker = new Walker();

  let output;

  if (typeof src === 'undefined') {
    throw new Error('src not given');
  }

  if (src === '') {
    return output;
  }

  walker.walk(src, node => {
    if (
      node.type === 'ExportNamedDeclaration' &&
      node.declaration.declarations[0].id.name === 'pageTitle'
    ) {
      output = node.declaration.declarations[0].init.value;
    }
  });

  return output;
};
