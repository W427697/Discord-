import React from 'react';
import dedent from 'ts-dedent';
import { useChannel, API } from '@storybook/api';
// @ts-ignore
// Being added: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/40674
import { transform } from '@babel/standalone';
import memoize from 'memoizerific';

import { LiveProvider, LiveEditor } from 'react-live';
import { EVENT_ID } from './constants';

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
    currentLocation: LocationMap
  };
  locationsMap: {
    [key: string]: LocationMap
  }
}

const SourceLoaderEvent = `storybook/source-loader/set`;

const Editor = ({ api }: { api: API}) => {
  const emit = useChannel({});
  const [initialCode, setCode] = React.useState('');

  let previousSource = "";

  const loadStoryCode = memoize(1)((sourceLoader: SourceLoaderInfo) => {
    const sourceCode = sourceLoader.edition.source;
    if (previousSource === sourceCode) {
      return null;
    }
    previousSource = sourceCode;
    const sourceSplitted = sourceCode.split('\n');

    if (sourceLoader.location) {
      setCode(
        sourceSplitted
          .filter(
            (_: any, idx: number) =>
              idx >= sourceLoader.location.currentLocation.startLoc.line - 1 &&
              idx < sourceLoader.location.currentLocation.endLoc.line
          )
          .join('\n').replace('export', '')
      );
    }
  })

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