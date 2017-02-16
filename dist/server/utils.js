'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.parseList = parseList;
exports.getHeadHtml = getHeadHtml;
exports.getEnvConfig = getEnvConfig;
exports.getMiddleware = getMiddleware;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseBoolean(str) {
  if (str === 'true') return true;
  if (str === 'false') return false;
  return str;
}

function parseList(str) {
  return str.split(',');
}

function getHeadHtml(configDirPath) {
  var headHtmlPath = _path2.default.resolve(configDirPath, 'head.html');
  var headHtml = '';
  if (_fs2.default.existsSync(headHtmlPath)) {
    headHtml = _fs2.default.readFileSync(headHtmlPath, 'utf8');
  }

  return headHtml;
}

function getEnvConfig(program, configEnv) {
  (0, _keys2.default)(configEnv).forEach(function (fieldName) {
    var envVarName = configEnv[fieldName];
    var envVarValue = parseBoolean(process.env[envVarName]);
    if (envVarValue) {
      program[fieldName] = envVarValue; // eslint-disable-line no-param-reassign
    }
  });
}

function getMiddleware(configDir) {
  var middlewarePath = _path2.default.resolve(configDir, 'middleware.js');
  if (_fs2.default.existsSync(middlewarePath)) {
    var middlewareModule = require(middlewarePath); // eslint-disable-line global-require
    if (middlewareModule.__esModule) {
      middlewareModule = middlewareModule.default;
    }
    return middlewareModule;
  }
  return function () {};
}