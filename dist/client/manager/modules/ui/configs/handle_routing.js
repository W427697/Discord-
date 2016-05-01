'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changeUrl = changeUrl;
exports.updateStore = updateStore;
exports.handleInitialUrl = handleInitialUrl;

exports.default = function (_ref, actions) {
  var reduxStore = _ref.reduxStore;

  // subscribe to reduxStore and change the URL
  reduxStore.subscribe(function () {
    return changeUrl(reduxStore);
  });
  changeUrl(reduxStore);

  // handle initial URL
  handleInitialUrl(actions);

  // handle back button
  window.onpopstate = function () {
    handleInitialUrl(actions);
  };
};

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function changeUrl(reduxStore) {
  var _reduxStore$getState = reduxStore.getState();

  var preview = _reduxStore$getState.preview;

  if (!preview) return;

  var selectedKind = preview.selectedKind;
  var selectedStory = preview.selectedStory;

  var queryString = _qs2.default.stringify({ selectedKind: selectedKind, selectedStory: selectedStory });

  if (queryString === '') return;

  var url = '?' + queryString;
  var state = {
    url: url,
    selectedKind: selectedKind,
    selectedStory: selectedStory
  };

  window.history.pushState(state, '', url);
}

function updateStore(queryParams, actions) {
  var selectedKind = queryParams.selectedKind;
  var selectedStory = queryParams.selectedStory;

  if (selectedKind && selectedStory) {
    actions.preview.selectStory(selectedKind, selectedStory);
  }
}

function handleInitialUrl(actions) {
  var queryString = window.location.search.substring(1);
  if (!queryString || queryString === '') return;

  var parsedQs = _qs2.default.parse(queryString);
  updateStore(parsedQs, actions);
}