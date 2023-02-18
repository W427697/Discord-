import { describe, expect, test } from '@jest/globals';
import { reactive } from 'vue';

import { updateArgs } from './render';

expect.addSnapshotSerializer({
  print: (val: any) => val,
  test: (val: unknown) => typeof val === 'string',
});

describe('render component with reactivity  Vue3', () => {
  test('update reactive Args', () => {
    const reactiveArgs = reactive({ label: 'Button', size: 'medium' });
    const newArgs = { label: 'Updated' };
    updateArgs(reactiveArgs, newArgs);
    expect(reactiveArgs).toMatchObject({ label: 'Updated' });
  });

  test('update reactive Args with empty object', () => {
    const reactiveArgs = reactive({ label: 'Button', size: 'medium' });
    const newArgs = {};
    updateArgs(reactiveArgs, newArgs);
    expect(reactiveArgs).toMatchObject({});
  });

  test('update reactive Args with new props', () => {
    const reactiveArgs = reactive({ primary: true });
    const newArgs = { label: 'New prop', primary: false };
    updateArgs(reactiveArgs, newArgs);
    expect(reactiveArgs).toMatchObject({ label: 'New prop', primary: false });
  });
});
