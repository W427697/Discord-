const path = require('path');
const {
  default: { createTransformer },
} = require('babel-jest');

module.exports = createTransformer({
  configFile: path.resolve(__dirname, '../../.babelrc'),
});
