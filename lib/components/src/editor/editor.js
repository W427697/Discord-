import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import { STORY_RENDERED } from '@storybook/core-events';
import { window } from 'global';

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: props.source,
      changePosition: props.changePosition,
      onChange: props.onChange || this.onChange,
    };
    this.editorDidMount = this.editorDidMount.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    const { resizeContainerReference } = this.props;

    const tryToBindToTheResizeContainer = !resizeContainerReference
      ? () => {}
      : () => {
          const containerObserver = new ResizeObserver(() => this.updateDimensions());

          const resizeContainer = resizeContainerReference();
          if (resizeContainer) containerObserver.observe(resizeContainer);
          else setTimeout(tryToBindToTheResizeContainer, 1000);
        };
    setTimeout(tryToBindToTheResizeContainer, 1000);
  }

  componentWillReceiveProps({ source, changePosition } = {}) {
    if (source) this.setState({ source });
    if (changePosition) this.setState({ changePosition });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  onChange = (newValue, e) => {
    console.log('onChange', newValue, e); // eslint-disable-line no-console
  };

  updateDimensions = () => {
    (this.editor || { layout: () => {} }).layout();
  };

  editorDidMount = (editor, monaco) => {
    this.editor = editor; // let's save it for further use
    const { changePosition } = this.state;
    const { componentDidMount, onStoryRendered } = this.props;
    editor.onDidChangeCursorPosition(e => changePosition(e, editor, monaco));
    componentDidMount(editor, monaco);
    editor.focus();
    const { channel } = this.props;
    if (channel) {
      channel.on(STORY_RENDERED, () => onStoryRendered.call(this.props, editor, monaco));
    }
  };

  render() {
    const { source, onChange } = this.state;

    const options = {
      selectOnLineNumbers: true,
    };
    return (
      <MonacoEditor
        language="javascript"
        theme="vs-dark"
        value={source}
        options={options}
        onChange={onChange}
        editorDidMount={this.editorDidMount}
      />
    );
  }
}

Editor.propTypes = {
  source: PropTypes.string,
  changePosition: PropTypes.func,
  onChange: PropTypes.func,
  componentDidMount: PropTypes.func,
  resizeContainerReference: PropTypes.func,
  onStoryRendered: PropTypes.func,
  channel: PropTypes.shape({
    emit: PropTypes.func,
    on: PropTypes.func,
    removeListener: PropTypes.func,
  }),
};

Editor.defaultProps = {
  source: '// no snippet found',
  changePosition: () => {},
  componentDidMount: () => {},
  onChange: null,
  resizeContainerReference: null,
  onStoryRendered: () => {},
  channel: null,
};
