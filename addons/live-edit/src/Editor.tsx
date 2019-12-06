/* eslint-disable consistent-return */
import React from 'react';
import { useChannel, API } from '@storybook/api';

import { STORY_CHANGED } from '@storybook/core-events';
import { SourceLoaderEvent, EVENT_NEW_SOURCE } from './constants';
import { useEditor } from './useEditor';
import CodeEditor from 'react-simple-code-editor';

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
  const [initialCode, setInitialCode] = useEditor();

  const [metaData, setMetadata] = React.useState<SourceLoaderInfo | null>(null);

  let previousSource = '';

  const loadStoryCode = (sourceLoader: SourceLoaderInfo) => {
    const sourceCode = sourceLoader.edition.source;
    setMetadata(sourceLoader);
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
      setInitialCode(sourceNormalized);
    }
  };

  useChannel({
    [STORY_CHANGED]: story => {
      if (metaData) {
        const sourceLoaded = metaData.edition.source;
        const sourceNormalized = sourceLoaded
          .split('\n')
          .filter((_: any, idx: number) => {
            return (
              idx >= metaData.location.locationsMap[story].startLoc.line - 1 &&
              idx < metaData.location.locationsMap[story].endLoc.line
            );
          })
          .join('\n')
          .replace('export', '');
        setInitialCode(sourceNormalized);
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

  return initialCode ? (
    <React.Fragment>
      <CodeEditor onValueChange={handleChangeTextArea} value={initialCode} />

    </React.Fragment>
  ) : null;
};

export default Editor;
