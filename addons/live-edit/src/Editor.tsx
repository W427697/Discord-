/* eslint-disable consistent-return */
import React from 'react';
import dedent from 'ts-dedent';
import { useChannel, API } from '@storybook/api';
// @ts-ignore
// Being added: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/40674
import { transform } from '@babel/standalone';

import { LiveProvider, LiveEditor } from 'react-live';
import { EVENT_ID, SET_STORY_RENDERED_EVENT, SourceLoaderEvent } from './constants';

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
  const [initialCode, setCode] = React.useState('');
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
      setCode(sourceNormalized);
    }
  };

  useChannel({
    [SET_STORY_RENDERED_EVENT]: story => {
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
        setCode(sourceNormalized);
      }
    },
  });

  React.useEffect(() => {
    api.on(SourceLoaderEvent, loadStoryCode);
  }, []);

  return initialCode ? (
    <LiveProvider
      code={initialCode}
      transformCode={input => {
        try {
          const output = transform(input, { presets: ['react'] }).code;
          emit(EVENT_ID, dedent(input));
          return output;
        } catch (e) {
          return input;
        }
      }}
    >
      <LiveEditor />
    </LiveProvider>
  ) : null;
};

export default Editor;
