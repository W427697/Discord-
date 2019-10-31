import * as React from 'react';

import { transform } from '@babel/standalone';
import { useChannel, useState, useParameter } from '@storybook/addons';
import { scopeEval } from './scopeEval';

export function withEditor(storyFn) {
  const initialCode = useParameter('editor') || '';
  const [state, setState] = useState(initialCode);
  useChannel({
    'new-source': s => {
      setState(s);
    },
  });

  const scope = storyFn();

  if (state) {
    try {
      return scopeEval(transform(state, { presets: [['react']] }).code, {
        ...scope,
        React,
      });
    } catch (e) {
      return <pre>{e.toString()}</pre>;
    }
  }
  return scope;
}
