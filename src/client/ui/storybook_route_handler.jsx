import * as React from 'react';
import Admin from './admin';

/**
 * Represents a class for handling the routing of the storybook application.
 */
export default class StorybookRouteHandler extends React.Component {
  constructor() {
    super();
    this.state = { data: null };
  }

  componentWillMount() {
    const syncedStore = this.props.syncedStore;

    syncedStore.watchData(data => {
      this.setState({ data });

      this.synchronizeBrowserHistory(data.selectedKind, data.selectedStory);
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
  componentWillReceiveProps(newProps) {
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
  handleSelectionUpdated(kind, story) {
    const newData = { ...this.state.data };

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
  handleKindSelected(kind) {
    const stories = this.state.data.storyStore.find(item => item.kind === kind).stories;

    this.handleSelectionUpdated(kind, stories[0]);
  }

    /**
     * Handles when a story is selected on the current kind of component.
     *
     * @param story {String} The name of the story to preview.
     */
  handleStorySelected(story) {
    this.handleSelectionUpdated(this.state.data.selectedKind, story);
  }

    /**
     * Handles when the story actions are cleared.
     */
  handleActionsCleared() {
    const data = this.props.syncedStore.getData();
    data.actions = [];
    this.props.syncedStore.setData(data);
  }

    /**
     * Synchronizes the browser history with the selected `kind` and `story`.
     *
     * @param {String} kind The kind of component being previewed.
     * @param {String} story The name of the story being previewed.
     */
  synchronizeBrowserHistory(kind, story) {
    const encodedKind = encodeURIComponent(kind);
    const encodedStory = encodeURIComponent(story);

    const path = `/${encodedKind}/${encodedStory}`;
    if (!this.context.router.isActive(path)) {
      this.context.router.push(path);
    }
  }

  render() {
    const data = this.state.data;

    if (!data) {
      return null;
    }

    return (
            <Admin
              data={data}
              onStorySelected={this.handleStorySelected.bind(this)}
              onKindSelected={this.handleKindSelected.bind(this)}
              onActionsCleared={this.handleActionsCleared.bind(this)}
    />);
  }
}

StorybookRouteHandler.propTypes = {
  syncedStore: React.PropTypes.object.isRequired,
  params: React.PropTypes.shape({
    kind: React.PropTypes.string,
    story: React.PropTypes.string,
  }),
};

StorybookRouteHandler.contextTypes = {
  router: React.PropTypes.object.isRequired,
};
