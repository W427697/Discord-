import React from 'react';
// @ts-ignore
import { useChannel, API, useStoryState } from '@storybook/api';
// @ts-ignore
import { styled } from '@storybook/theming';
// @ts-ignore
import { SyntaxHighlighter } from '@storybook/components';
import { SourceLoaderEvent, EVENT_NEW_SOURCE, ADDON_NAME } from './constants';

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
  const [currentCode, setCurrentCode] = useStoryState(ADDON_NAME, '');
  const [metaData, setMetadata] = React.useState<SourceLoaderInfo | null>(null);

  let previousSource = '';

  // eslint-disable-next-line
  const loadStoryCode = (sourceLoader: SourceLoaderInfo) => {
    const sourceCode = sourceLoader.edition.source;
    if (previousSource === sourceCode) {
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
      setCurrentCode(sourceNormalized);
    }
  };

  useChannel({
    [SourceLoaderEvent]: loadStoryCode,
  });

  function handleChangeTextArea(evt: any) {
    setCurrentCode(evt.target.value);
  }

  return currentCode ? (
    <EditorWrapper>
      <CodeEditor onChange={handleChangeTextArea} value={currentCode} />
      <SyntaxHighlighter language="jsx" format={false}>
        {currentCode}
      </SyntaxHighlighter>
    </EditorWrapper>
  ) : null;
};

export default Editor;
