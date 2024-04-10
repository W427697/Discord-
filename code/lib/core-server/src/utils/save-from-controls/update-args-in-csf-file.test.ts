/* eslint-disable no-underscore-dangle */
import { describe, test, expect } from 'vitest';
import { readCsf, printCsf } from '@storybook/csf-tools';

import { updateArgsInCsfFile } from './update-args-in-csf-file';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { getDiff } from './getDiff';

const makeTitle = (userTitle: string) => userTitle;

const FILES = {
  satisfies: join(__dirname, 'mocks/satisfies.stories.tsx'),
};

describe('success', () => {
  test('TS satisfies', async () => {
    const newArgs = { bordered: true, initial: 'test1' };

    const before = await readFile(FILES.satisfies, 'utf-8');
    const CSF = await readCsf(FILES.satisfies, { makeTitle });

    const parsed = CSF.parse();
    const names = Object.keys(parsed._stories);
    const nodes = names.map((name) => CSF.getStoryExport(name));

    nodes.forEach((node) => {
      updateArgsInCsfFile(node, newArgs);
    });

    const after = printCsf(parsed);

    // check if the code was updated at all
    expect(after.code).not.toBe(before);

    // check if the code was updated correctly
    expect(getDiff(before, after.code)).toMatchInlineSnapshot(`
      "...
        type Story = StoryObj<typeof TabsState>;
        
        export const RenderNoArgs = {
        
      +   args: {
      +     bordered: true,
      +     initial: "test1"
      +   },
      + 
      + 
          render: (args) => (
            <TabsState {...args}>
              <div id="test1" title="With a function">
                {
      ...
                <div>test2 is always active (but visually hidden)</div>
              </div>
            </TabsState>
        
      -   ),
      +   )
        
        } satisfies Story;
        
        export const RenderArgs = {
      ...
        export const RenderArgs = {
          args: {
            absolute: true,
        
      +     bordered: true,
      +     initial: "test1"
      + 
          },
          render: (args) => (
            <TabsState {...args}>
              <div id="test1" title="With a function">
      ...
          args: {
            absolute: true,
            bordered: true,
        
      -     initial: 'test2',
      +     initial: "test1",
        
          },
          render: (args) => (
            <TabsState {...args}>
      ..."
    `);
  });
});
