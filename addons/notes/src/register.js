import React from 'react';
import PropTypes from 'prop-types';
import TurndownService from 'turndown';
import addons from '@storybook/addons';

const styles = {
  notesPanel: {
    margin: 10,
    fontFamily: 'Arial',
    fontSize: 14,
    color: '#444',
    width: '100%',
    overflow: 'auto',
    position: 'relative',
  },
  toggleButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
};

/* eslint-disable */
const getQueryParams = (search=window.location.search) => {
  const query = search.split('+').join(' ');
  const params = {};
  const re = /[?&]?([^=]+)=([^&]*)/g
  let tokens
  while ((tokens = re.exec(query))) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }
  return params;
}
/* eslint-enable */

const turndown = new TurndownService();
const htmlToMarkdown = html => turndown.turndown(html);

export class Notes extends React.Component {
  constructor(...args) {
    super(...args);
    this.onAddNotes = this.onAddNotes.bind(this);
  }

  state = {
    html: '',
    markdown: '',
    editing: false,
    loading: false,
  };

  componentDidMount() {
    const { channel, api } = this.props;
    // Listen to the notes and render it.
    channel.on('storybook/notes/add_notes', this.onAddNotes);

    // Clear the current notes on every story change.
    this.stopListeningOnStory = api.onStory(() => {
      this.onAddNotes('');
    });
  }

  // This is some cleanup tasks when the Notes panel is unmounting.
  componentWillUnmount() {
    if (this.stopListeningOnStory) {
      this.stopListeningOnStory();
    }

    const { channel } = this.props;
    channel.removeListener('storybook/notes/add_notes', this.onAddNotes);
  }

  onAddNotes(html) {
    const markdown = htmlToMarkdown(html);
    this.setState({ html, markdown });
  }

  startEditing = () => {
    this.setState({ editing: true });
  };

  /* eslint-disable */
  stopEditing = async () => {
    // This is probably unnecessary but for now we wanna keep everything in sync.
    this.setState({ loading: true, editing: false });

    // TODO: use a separate file for each meta daum (i.e. notes) instead of a
    // big config.json
    const readResponse = await fetch(`//localhost:${FILE_WRITE_SERVER_PORT}/stories/config.json`, {
      method: 'get',
    });
    const config = await readResponse.json();
    const { selectedKind, selectedStory } = getQueryParams();
    const currentStory = config[selectedKind].find(
      story => story.name.toLowerCase() === selectedStory.toLowerCase()
    );
    if (!currentStory.meta) {
      currentStory.meta = {};
    }
    currentStory.meta.notes = this.state.markdown;
    try {
      const writeResponse = await fetch(
        `//localhost:${FILE_WRITE_SERVER_PORT}/stories/config.json`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: JSON.stringify(config, null, 4) }),
        }
      );
      if (writeResponse.status !== 200) {
        alert('something went wrong :(');
      }
    } catch (error) {
      alert(error.message);
    }
  };
  /* eslint-enable */

  handleChange = event => {
    this.setState({ markdown: event.target.value });
  };

  /* eslint-disable react/no-danger */
  render() {
    const { loading, editing, html, markdown } = this.state;

    if (loading) {
      return (
        <div className="addon-notes-container" style={styles.notesPanel}>
          loading...
        </div>
      );
    }

    if (editing) {
      return (
        <div className="addon-notes-container" style={styles.notesPanel}>
          <textarea onChange={this.handleChange} value={markdown} />
          <button onClick={this.stopEditing} style={styles.toggleButton}>
            done
          </button>
        </div>
      );
    }

    const textAfterFormatted = html
      ? html
          .trim()
          .replace(/(<\S+.*>)\n/g, '$1')
          .replace(/\n/g, '<br />')
      : '';
    return (
      <div className="addon-notes-container" style={styles.notesPanel}>
        <div dangerouslySetInnerHTML={{ __html: textAfterFormatted }} />
        <button onClick={this.startEditing} style={styles.toggleButton}>
          edit
        </button>
      </div>
    );
  }
}

Notes.propTypes = {
  channel: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  api: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};
Notes.defaultProps = {
  channel: {},
  api: {},
};

// Register the addon with a unique name.
addons.register('storybook/notes', api => {
  // Also need to set a unique name to the panel.
  addons.addPanel('storybook/notes/panel', {
    title: 'Notes',
    render: () => <Notes channel={addons.getChannel()} api={api} />,
  });
});
