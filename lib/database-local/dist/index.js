'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LocalPersister = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createDatabase;

var _storybookDatabase = require('@kadira/storybook-database');

var _storybookDatabase2 = _interopRequireDefault(_storybookDatabase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createDatabase(_ref) {
  var url = _ref.url;

  var persister = new LocalPersister({ url: url });
  return new _storybookDatabase2.default({ persister: persister });
}

var LocalPersister = exports.LocalPersister = function () {
  function LocalPersister(_ref2) {
    var url = _ref2.url;

    _classCallCheck(this, LocalPersister);

    this.url = url;
    this.headers = { 'content-type': 'application/json' };
  }

  _createClass(LocalPersister, [{
    key: 'set',
    value: function set(collection, item) {
      var body = JSON.stringify({ collection: collection, item: item });
      var params = { body: body, method: 'post', headers: this.headers };
      return fetch(this.url + '/set', params).then(function (res) {
        return res.json();
      }).then(function (res) {
        return res.data;
      });
    }
  }, {
    key: 'get',
    value: function get(collection, query, options) {
      var sort = options.sort;
      var limit = options.limit;

      var body = JSON.stringify({ collection: collection, query: query, sort: sort, limit: limit });
      var params = { body: body, method: 'post', headers: this.headers };
      return fetch(this.url + '/get', params).then(function (res) {
        return res.json();
      }).then(function (res) {
        return res.data;
      });
    }
  }]);

  return LocalPersister;
}();