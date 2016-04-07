'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WithState = exports.withState = exports.configure = exports.action = exports.storiesOf = undefined;
exports.getStoryStore = getStoryStore;
exports.getSyncedStore = getSyncedStore;

var _synced_store = require('./synced_store');

var _synced_store2 = _interopRequireDefault(_synced_store);

var _story_store = require('./story_store');

var _story_store2 = _interopRequireDefault(_story_store);

var _client_api = require('./client_api');

var _client_api2 = _interopRequireDefault(_client_api);

var _config_api = require('./config_api');

var _config_api2 = _interopRequireDefault(_config_api);

var _with_state = require('./with_state');

var _with_state2 = _interopRequireDefault(_with_state);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storyStore = new _story_store2.default();
var syncedStore = new _synced_store2.default(window);
var clientApi = new _client_api2.default({ storyStore: storyStore, syncedStore: syncedStore });
var configApi = new _config_api2.default({ storyStore: storyStore, syncedStore: syncedStore });
syncedStore.init();

function getStoryStore() {
  return storyStore;
}

function getSyncedStore() {
  return syncedStore;
}

var storiesOf = exports.storiesOf = clientApi.storiesOf.bind(clientApi);
var action = exports.action = clientApi.action.bind(clientApi);
var configure = exports.configure = configApi.configure.bind(configApi);

var withState = exports.withState = _with_state2.default.withState;
var WithState = exports.WithState = _with_state2.default.WithState;