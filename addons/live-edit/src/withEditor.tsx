import * as React from 'react';
// @ts-ignore
import { transform } from '@babel/standalone';
import { useParameter } from '@storybook/addons';
// @ts-ignore
import { useStoryState } from '@storybook/client-api';
import { scopeEval } from './scopeEval';
import { LiveEditConfiguration } from './types';
import { ADDON_NAME } from './constants';

export function withEditor(storyFn: any) {
  const [currentCode, setCurrentCode] = useStoryState(ADDON_NAME, '');
  const scope = useParameter('scope');
  const liveEditConfig: LiveEditConfiguration | undefined = useParameter('live-edit');
  const scopeComponents =
    liveEditConfig && liveEditConfig.components ? liveEditConfig.components : {};

  console.log({
    currentCode,
  });

  if (currentCode) {
    try {
      return scopeEval(transform(currentCode, { presets: [['react']] }).code, {
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
