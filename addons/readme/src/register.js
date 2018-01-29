/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import addons from '@storybook/addons';
import 'github-markdown-css/github-markdown.css';

const style = {
  padding: '0 25px 25px',
  width: '100%',
};

export class ReadMe extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { text: '' };
  }

  componentDidMount() {
    const { channel, api } = this.props;
    // Listen to the notes and render it.
    channel.on('storybook/readme/add_readme', this.onAddNotes);

    // Clear the current notes on every story change.
    this.stopListeningOnStory = api.onStory(() => {
      this.onAddNotes('');
    });
  }

  onAddNotes = text => {
    this.setState({ text });
  };

  render() {
    const { text } = this.state;
    return (
      <div className="markdown-body" style={style}>
        <div dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    );
  }
}

ReadMe.propTypes = {
  channel: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  api: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

ReadMe.defaultProps = {
  channel: {},
  api: {},
};

// Register the addon with a unique name.
addons.register('storybook/readme', api => {
  // Also need to set a unique name to the panel.
  addons.addPanel('storybook/readme/panel', {
    title: 'Read Me',
    render: () => <ReadMe channel={addons.getChannel()} api={api} />,
  });
});
