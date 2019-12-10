/* eslint-disable consistent-return */
import React from 'react';
import { useChannel, API, useCurrentStory } from '@storybook/api';
import { STORY_CHANGED } from '@storybook/core-events';
import CodeEditor from 'react-simple-code-editor';
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import { SourceLoaderEvent, EVENT_NEW_SOURCE } from './constants';
import { useEditor } from './useEditor';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';

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

const Editor = ({ api }: { api: API }) => {
  const emit = useChannel({});
  const story = useCurrentStory();
  const storyId = story && story.id ? story.id : '';
  const [initialCode, setInitialCode] = useEditor();
  const [metaData, setMetadata] = React.useState<SourceLoaderInfo | null>(null);

  let previousSource = '';

  const loadStoryCode = (sourceLoader: SourceLoaderInfo) => {
    const sourceCode = sourceLoader.edition.source;
    setMetadata(sourceLoader);
    if (previousSource === sourceCode || initialCode[storyId]) {
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
      setInitialCode(sourceNormalized, storyId);
    }
  };

  useChannel({
    [STORY_CHANGED]: nextStory => {
      if (metaData && !initialCode[nextStory]) {
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
        setInitialCode(sourceNormalized, storyId);
      }
    },
  });

  React.useEffect(() => {
    if (story && storyId) {
      api.on(SourceLoaderEvent, loadStoryCode);
    }
  }, [story]);

  function handleChangeTextArea(code: string) {
    setInitialCode(code, storyId);
    emit(EVENT_NEW_SOURCE, code);
  }

  const code = story && storyId ? initialCode[storyId] : '';

  return code ? (
    <CodeEditor
      value={code}
      onValueChange={handleChangeTextArea}
      highlight={editedCode => highlight(editedCode, languages.js)}
    />
  ) : null;
};

export default Editor;
