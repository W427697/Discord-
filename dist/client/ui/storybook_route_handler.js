'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _admin = require('./admin');

var _admin2 = _interopRequireDefault(_admin);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Represents a class for handling the routing of the storybook application.
 */

var StorybookRouteHandler = function (_React$Component) {
  (0, _inherits3.default)(StorybookRouteHandler, _React$Component);

  function StorybookRouteHandler() {
    (0, _classCallCheck3.default)(this, StorybookRouteHandler);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(StorybookRouteHandler).call(this));

    _this.state = { data: null };
    return _this;
  }

  (0, _createClass3.default)(StorybookRouteHandler, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      var syncedStore = this.props.syncedStore;

      syncedStore.watchData(function (data) {
        _this2.setState({ data: data });

        _this2.synchronizeBrowserHistory(data.selectedKind, data.selectedStory);
      });

      if (!this.props.params.kind) {
        this.setState({ data: syncedStore.getData() });
        return;
      }

      if (!this.props.params.story) {
        this.handleKindSelected(this.props.params.kind);
      } else {
        this.handleSelectionUpdated(this.props.params.kind, this.props.params.story);
      }
    }

    /**
     * Called when the component will receive new properties.
     */

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      if (!newProps.params.story) {
        this.handleKindSelected(newProps.params.kind);
      } else {
        this.handleSelectionUpdated(newProps.params.kind, newProps.params.story);
      }
    }

    /**
     * Handles when the selection has been updated.
     *
     * @param kind {String} The name of the kind of component to preview.
     * @param story {String} The name of the story to preview.
     */

  }, {
    key: 'handleSelectionUpdated',
    value: function handleSelectionUpdated(kind, story) {
      var newData = (0, _extends3.default)({}, this.state.data);

      newData.selectedKind = kind;
      newData.selectedStory = story;

      this.props.syncedStore.setData(newData);
    }

    /**
     * Handles when a kind of component has been selected to preview.
     * This will automatically select the first story associated with the kind.
     *
     * @param kind {String} The name of the kind of component to preview.
     */

  }, {
    key: 'handleKindSelected',
    value: function handleKindSelected(kind) {
      var stories = this.state.data.storyStore.find(function (item) {
        return item.kind === kind;
      }).stories;

      this.handleSelectionUpdated(kind, stories[0]);
    }

    /**
     * Handles when a story is selected on the current kind of component.
     *
     * @param story {String} The name of the story to preview.
     */

  }, {
    key: 'handleStorySelected',
    value: function handleStorySelected(story) {
      this.handleSelectionUpdated(this.state.data.selectedKind, story);
    }

    /**
     * Handles when the story actions are cleared.
     */

  }, {
    key: 'handleActionsCleared',
    value: function handleActionsCleared() {
      var data = this.props.syncedStore.getData();
      data.actions = [];
      this.props.syncedStore.setData(data);
    }

    /**
     * Synchronizes the browser history with the selected `kind` and `story`.
     *
     * @param {String} kind The kind of component being previewed.
     * @param {String} story The name of the story being previewed.
     */

  }, {
    key: 'synchronizeBrowserHistory',
    value: function synchronizeBrowserHistory(kind, story) {
      var encodedKind = encodeURIComponent(kind);
      var encodedStory = encodeURIComponent(story);

      var path = '/' + encodedKind + '/' + encodedStory;
      if (!this.context.router.isActive(path)) {
        this.context.router.push(path);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var data = this.state.data;

      if (!data) {
        return null;
      }

      return React.createElement(_admin2.default, {
        data: data,
        onStorySelected: this.handleStorySelected.bind(this),
        onKindSelected: this.handleKindSelected.bind(this),
        onActionsCleared: this.handleActionsCleared.bind(this)
      });
    }
  }]);
  return StorybookRouteHandler;
}(React.Component);

exports.default = StorybookRouteHandler;


StorybookRouteHandler.propTypes = {
  syncedStore: React.PropTypes.object.isRequired,
  params: React.PropTypes.shape({
    kind: React.PropTypes.string,
    story: React.PropTypes.string
  })
};

StorybookRouteHandler.contextTypes = {
  router: React.PropTypes.object.isRequired
};