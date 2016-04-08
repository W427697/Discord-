import React from 'react';
import RedBox from 'redbox-react';

/**
 * Represents a functional component that renders a placeholder
 * when there's no preview available.
 */
const NoPreview = () => (<p>No Preview Available!</p>);

/**
 * Represents a component that renders a story preview.
 */
export default class Preview extends React.Component {
  constructor() {
    super();
    this.state = { data: null };
  }

  componentWillMount() {
    this.setState({ data: this.props.syncedStore.getData() });

    this.props.syncedStore.watchData(data => this.setState({ data }));
  }

  renderError(error) {
    const realError = new Error(error.message);
    realError.stack = error.stack;

    return <RedBox error={realError} />;
  }

  renderPreview(data) {
    const { selectedKind, selectedStory } = data;

    const story = this.props.storyStore.getStory(selectedKind, selectedStory);

    return story ? story() : <NoPreview />;
  }

  render() {
    const data = this.state.data;

    return data.error ? this.renderError(data.error) : this.renderPreview(data);
  }
}

Preview.propTypes = {
  syncedStore: React.PropTypes.object.isRequired,
  storyStore: React.PropTypes.object.isRequired,
};
