import { expect, test } from 'vitest';
import { fn, isMockFunction } from '@storybook/test';
import { action } from '@storybook/addon-actions';

import { traverseArgs } from './preview';

test('traverseArgs', () => {
  const args = {
    deep: {
      deeper: {
        fnKey: fn(),
        actionKey: action('name'),
      },
    },
    arg2: Object.freeze({ frozen: true }),
  };

  expect(args.deep.deeper.fnKey.getMockName()).toEqual('spy');

  const traversed = traverseArgs(args) as typeof args;
  expect(traversed).toEqual({
    deep: {
      deeper: {
        fnKey: args.deep.deeper.fnKey,
        actionKey: args.deep.deeper.actionKey,
      },
    },
    arg2: args.arg2,
  });

  expect(traversed.deep.deeper.fnKey.getMockName()).toEqual('fnKey');
  const actionFn = traversed.deep.deeper.actionKey;
  expect(isMockFunction(actionFn) && actionFn.getMockName()).toEqual('actionKey');
});
