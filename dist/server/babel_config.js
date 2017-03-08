'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (configDir) {
  var babelConfig = loadFromPath(_path2.default.resolve(configDir, '.babelrc'));
  var inConfigDir = true;

  if (!babelConfig) {
    babelConfig = loadFromPath('.babelrc');
    inConfigDir = false;
  }

  if (babelConfig) {
    // If the custom config uses babel's `extends` clause, then replace it with
    // an absolute path. `extends` will not work unless we do this.
    if (babelConfig.extends) {
      babelConfig.extends = inConfigDir ? _path2.default.resolve(configDir, babelConfig.extends) : _path2.default.resolve(babelConfig.extends);
    }
  }

  return babelConfig || _babel2.default;
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _json = require('json5');

var _json2 = _interopRequireDefault(_json);

var _babel = require('./config/babel.js');

var _babel2 = _interopRequireDefault(_babel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// avoid ESLint errors
/* eslint global-require: 0 */

var logger = console;

// Tries to load a .babelrc and returns the parsed object if successful
function loadFromPath(babelConfigPath) {
  var config = void 0;
  if (_fs2.default.existsSync(babelConfigPath)) {
    var content = _fs2.default.readFileSync(babelConfigPath, 'utf-8');
    try {
      config = _json2.default.parse(content);
      config.babelrc = false;
      logger.info('=> Loading custom .babelrc');
    } catch (e) {
      logger.error('=> Error parsing .babelrc file: ' + e.message);
      throw e;
    }
  }

  if (!config) return null;

  return config;
}