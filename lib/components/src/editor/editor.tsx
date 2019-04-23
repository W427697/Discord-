import { window } from 'global'
import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import ResizeDetector from 'react-resize-detector';
import { STORY_RENDERED } from '@storybook/core-events';
import * as api from '@storybook/api'
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import { ChangeHandler } from 'react-monaco-editor';

export type ChangePositionFunction = (e: monacoEditor.editor.ICursorPositionChangedEvent,
  editor: monacoEditor.editor.IStandaloneCodeEditor,
  monaco: typeof monacoEditor) => void


export interface EditorProps {
  source?: string,
  changePosition?: ChangePositionFunction,
  componentDidMount?: (editor: monacoEditor.editor.IStandaloneCodeEditor,
    monaco: typeof monacoEditor) => void,
  onChange?: ChangeHandler,
  resizeContainerReference?: () => Element,
  onStoryRendered?: () => void,
  api?: api.API,
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
    const { resizeContainerReference } = this.props;
  }

  componentWillReceiveProps({ source, changePosition }: EditorProps = {}) {
    if (source) this.setState({ source });
    if (changePosition) this.setState({ changePosition });
  }

  onChange: ChangeHandler = (newValue, e) => {
    console.log('onChange', newValue, e); // eslint-disable-line no-console
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
    const { api } = this.props;
    if (api) {
      api.on(STORY_RENDERED, () => onStoryRendered.call(this.props, editor, monaco));
    }
  };

  render() {
    const { source, onChange } = this.state;

    const options = {
      selectOnLineNumbers: true,
    };
    return (
      <ResizeDetector handleWidth handleHeight>
      {({ width, height } : {width: number, height: number}) => {
      (this.editor || { layout: () => { } }).layout();
      return (<MonacoEditor
        language="javascript"
        theme="vs-dark"
        value={source}
        options={options}
        onChange={onChange}
        editorDidMount={this.editorDidMount}
      />)
      }}
      </ResizeDetector>
    );
  }
}

