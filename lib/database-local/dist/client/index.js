'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createDatabase;

var _storybookDatabase = require('@kadira/storybook-database');

var _storybookDatabase2 = _interopRequireDefault(_storybookDatabase);

var _persister = require('./persister');

var _persister2 = _interopRequireDefault(_persister);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createDatabase(_ref) {
  var url = _ref.url;

  var persister = new _persister2.default({ url: url });
  return new _storybookDatabase2.default({ persister: persister });
}