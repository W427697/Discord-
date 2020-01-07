/* eslint-disable consistent-return */
import React from 'react';
import { useChannel, API } from '@storybook/api';
import { STORY_CHANGED } from '@storybook/core-events';
import { styled } from '@storybook/theming';
import { SyntaxHighlighter } from '@storybook/components';
import { SourceLoaderEvent, EVENT_NEW_SOURCE } from './constants';
import { useEditor } from './useEditor';

interface CodeLoc {
  col: number;
  line: number;
}

interface LocationMap {
  startLoc: CodeLoc;
  endLoc: CodeLoc;
  startBody: CodeLoc;
  endBody: CodeLoc;
}

interface SourceLoaderInfo {
  edition: {
    source: string;
    prefix: string;
    mainFileLocation: string;
    dependencies?: Array<string>;
    localDependencies?: Record<string, string>;
  };
  story: {
    kind: string;
    story: string;
  };
  location: {
    currentLocation: LocationMap;
    locationsMap: {
      [key: string]: LocationMap;
    };
  };
}

const EditorWrapper = styled.div`
  padding: 10px;
`;

const CodeEditor = styled.textarea`
  position: absolute;
  margin: 0px;
  border: 0;
  padding: 0;
  font-family: 'Operator Mono', 'Fira Code Retina', 'Fira Code', 'FiraCode-Retina', 'Andale Mono',
    'Lucida Console', Consolas, Monaco, monospace;
  line-height: 18px;
  top: 10px;
  left: 12px;
  -webkit-text-fill-color: transparent;
  z-index: 999;
  background: transparent;
  height: 97%;
  width: 98%;
`;

const Editor = ({ api }: { api: API }) => {
  const emit = useChannel({});
  const [initialCode, setInitialCode] = useEditor();
  const [metaData, setMetadata] = React.useState<SourceLoaderInfo | null>(null);

  let previousSource = '';

  const loadStoryCode = (sourceLoader: SourceLoaderInfo) => {
    const sourceCode = sourceLoader.edition.source;
    setMetadata(sourceLoader);
    if (previousSource === sourceCode || initialCode) {
      return null;
    }
    previousSource = sourceCode;
    const sourceSplitted = sourceCode.split('\n');

    if (sourceLoader.location) {
      const sourceNormalized = sourceSplitted
        .filter((_: any, idx: number) => {
          return (
            idx >= sourceLoader.location.currentLocation.startLoc.line - 1 &&
            idx < sourceLoader.location.currentLocation.endLoc.line
          );
        })
        .join('\n')
        .replace('export', '');
      setInitialCode(sourceNormalized);
    }
  };

  useChannel({
    [STORY_CHANGED]: nextStory => {
      const nextStorySavedCode = initialCode[nextStory];
      if (metaData && !nextStorySavedCode) {
        const sourceLoaded = metaData.edition.source;
        const sourceNormalized = sourceLoaded
          .split('\n')
          .filter((_: any, idx: number) => {
            return (
              idx >= metaData.location.locationsMap[nextStory].startLoc.line - 1 &&
              idx < metaData.location.locationsMap[nextStory].endLoc.line
            );
          })
          .join('\n')
          .replace('export', '');
        setInitialCode(sourceNormalized);
      } else if (nextStorySavedCode) {
        emit(EVENT_NEW_SOURCE, nextStorySavedCode);
      }
    },
  });

  React.useEffect(() => {
    api.on(SourceLoaderEvent, loadStoryCode);
  }, []);

  function handleChangeTextArea(code: string) {
    setInitialCode(code);
    emit(EVENT_NEW_SOURCE, code);
  }

  const code = initialCode;

  return code ? (
    <EditorWrapper>
      <CodeEditor onChange={evt => handleChangeTextArea(evt.target.value)} value={code} />
      <SyntaxHighlighter language="jsx" format={false}>
        {code}
      </SyntaxHighlighter>
    </EditorWrapper>
  ) : null;
};

export default Editor;
