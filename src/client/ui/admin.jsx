import * as React from 'react';
import StorybookControls from './controls';
import Layout from './layout';
import ActionLogger from './action_logger';
import stringify from 'json-stringify-safe';

/**
 * Represents the core admin view.
 */
export default class Admin extends React.Component {
  renderControls() {
    const data = this.props.data;

    return (
            <StorybookControls
              storyStore={data.storyStore}
              selectedKind={data.selectedKind}
              selectedStory={data.selectedStory}
              onKind={this.props.onKindSelected}
              onStory={this.props.onStorySelected}
            />
        );
  }

  renderIframe() {
    const data = this.props.data;

    const iframeStyle = {
      width: '100%',
      height: '100%',
      border: '1px solid #ECECEC',
      borderRadius: 4,
      backgroundColor: '#FFF',
    };

        // We need to send dataId via queryString
        // That's how our data layer can start communicate via the iframe.
    const queryString = `dataId=${data.dataId}`;

    return (
            <iframe
              style={iframeStyle}
              src={`/iframe?${queryString}`}
            />
        );
  }

  renderActionLogger() {
    const { actions = [] } = this.props.data;
    const log = actions
            .map(action => stringify(action, null, 2))
            .join('\n\n');

    return <ActionLogger actionLog={log} onClear={this.props.onActionsCleared} />;
  }

  render() {
    const controls = this.renderControls();
    const iframe = this.renderIframe();
    const actionLogger = this.renderActionLogger();

    return (
            <Layout
              controls={controls}
              preview={iframe}
              actionLogger={actionLogger}
            />
        );
  }
}

Admin.propTypes = {
  data: React.PropTypes.object.isRequired,
  onStorySelected: React.PropTypes.func,
  onKindSelected: React.PropTypes.func,
  onActionsCleared: React.PropTypes.func,
};
