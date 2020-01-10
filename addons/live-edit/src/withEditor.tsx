import * as React from 'react';
// @ts-ignore
import { transform } from '@babel/standalone';
import { useChannel, useState, useParameter } from '@storybook/addons';
// @ts-ignore;
import { useStoryId } from '@storybook/client-api';
import { scopeEval } from './scopeEval';
import { LiveEditConfiguration } from './types';
import { EVENT_NEW_SOURCE } from './constants';

export function withEditor(storyFn: any) {
  const [state, setState] = useState('');
  const scope = useParameter('scope');
  const liveEditConfig: LiveEditConfiguration | undefined = useParameter('live-edit');
  const scopeComponents =
    liveEditConfig && liveEditConfig.components ? liveEditConfig.components : {};

  useChannel({
    [EVENT_NEW_SOURCE]: s => {
      setState(s);
    },
  });

  const storyId = useStoryId();

  console.log({ storyId });

  if (state) {
    try {
      return scopeEval(transform(state, { presets: [['react']] }).code, {
        // @ts-ignore
        ...scope,
        ...scopeComponents,
        React,
      });
    } catch (e) {
      return <pre>{e.toString()}</pre>;
    }
  }
  return storyFn();
}
