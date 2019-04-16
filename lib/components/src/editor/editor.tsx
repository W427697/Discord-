import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
import { STORY_RENDERED } from '@storybook/core-events';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { ChangeHandler } from 'react-monaco-editor';
import * as global from 'global';


export type ChangePositionFunction = (e: monacoEditor.editor.ICursorPositionChangedEvent, 
  editor: monacoEditor.editor.IStandaloneCodeEditor,
  monaco: typeof monacoEditor) => void


export interface EditorProps {
  source?: string,
  changePosition?: ChangePositionFunction,
  componentDidMount?: (editor: monacoEditor.editor.IStandaloneCodeEditor,
                      monaco: typeof monacoEditor) => void,
  onChange?: ChangeHandler,
  resizeContainerReference?: ()=> Element,
  onStoryRendered?: () => void,
  channel?: any,
}

export interface EditorState {
  source: string,
  changePosition: ChangePositionFunction,
  onChange: ChangeHandler
}

export class Editor extends Component<EditorProps, EditorState> {
  editor: monacoEditor.editor.IStandaloneCodeEditor
  constructor(props: EditorProps) {
    super(props);
    this.state = {
      source: props.source,
      changePosition: props.changePosition,
      onChange: props.onChange || this.onChange,
    };
  }

  componentDidMount() {
    global.window.addEventListener('resize', this.updateDimensions);
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

  componentWillReceiveProps({ source, changePosition } : EditorProps = {}) {
    if (source) this.setState({ source });
    if (changePosition) this.setState({ changePosition });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  onChange : ChangeHandler = (newValue, e) => {
    console.log('onChange', newValue, e); // eslint-disable-line no-console
  };

  updateDimensions = () => {
    (this.editor || { layout: () => {} }).layout();
  };

  editorDidMount = (editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor) => {
    this.editor = editor; // let's save it for further use
    const { changePosition } = this.state;
    const { componentDidMount, onStoryRendered } = this.props;
    editor.onDidChangeCursorPosition(
      (e: monacoEditor.editor.ICursorPositionChangedEvent) => changePosition(e, editor, monaco));
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

