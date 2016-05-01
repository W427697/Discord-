'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composer = undefined;

var _left_panel = require('../components/left_panel');

var _left_panel2 = _interopRequireDefault(_left_panel);

var _mantraCore = require('mantra-core');

var _lodash = require('lodash.pick');

var _lodash2 = _interopRequireDefault(_lodash);

var _filters = require('../libs/filters');

var filters = _interopRequireWildcard(_filters);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var composer = exports.composer = function composer(_ref, onData) {
  var context = _ref.context;
  var actions = _ref.actions;

  var _context = context();

  var reduxStore = _context.reduxStore;

  var actionMap = actions();

  var processState = function processState() {
    var _reduxStore$getState = reduxStore.getState();

    var preview = _reduxStore$getState.preview;
    var ui = _reduxStore$getState.ui;

    if (preview) {
      var stories = preview.stories;
      var selectedKind = preview.selectedKind;
      var selectedStory = preview.selectedStory;
      var storyFilter = ui.storyFilter;

      var data = {
        stories: filters.storyFilter(stories, storyFilter, selectedKind, selectedStory),
        selectedKind: selectedKind,
        selectedStory: selectedStory,
        onSelectStory: actionMap.preview.selectStory,

        storyFilter: storyFilter,
        onStoryFilter: actionMap.ui.setStoryFilter
      };
      onData(null, data);
    } else {
      onData(null, {});
    }
  };

  processState();
  reduxStore.subscribe(processState);
};

exports.default = (0, _mantraCore.composeAll)((0, _mantraCore.compose)(composer), (0, _mantraCore.useDeps)())(_left_panel2.default);