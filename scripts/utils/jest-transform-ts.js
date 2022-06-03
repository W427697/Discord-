const {
  default: { createTransformer },
} = require('jest-preset-angular');
const babelTransformer = require('./jest-transform-js');

module.exports.process = function transform(src, path, config, transformOptions) {
  const tsTransformer = createTransformer(config, transformOptions);
  const tsResult = tsTransformer.process(src, path, config, transformOptions);
  const jsPath = path.replace('.ts', '.js');
  const source = typeof tsResult === 'string' ? tsResult : tsResult.code;

  return babelTransformer.process(source, jsPath, config, transformOptions);
};
