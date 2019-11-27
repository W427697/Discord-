import * as React from 'react';
// @ts-ignore
import { transform } from '@babel/standalone';
import { useChannel, useState, useParameter } from '@storybook/addons';
import { scopeEval } from './scopeEval';
import { LiveEditConfiguration } from './types';
import { EVENT_ID } from './constants';

export function withEditor(storyFn: any) {
  const [state, setState] = useState('');
  const scope = useParameter('scope');
  const liveEditConfig: LiveEditConfiguration | undefined = useParameter('live-edit');
  const scopeComponents = liveEditConfig && liveEditConfig.components ? liveEditConfig.components : {};

  useChannel({
    [EVENT_ID]: s => {
      setState(s);
    }
  });

  if (state) {
    try {
      return scopeEval(transform(state, { presets: [['react']] }).code, {
        ...scope,
        ...scopeComponents,
        React,
      });
		} catch (e) {
      return <pre>{e.toString()}</pre>;
    }
  }
  return scope;
}
