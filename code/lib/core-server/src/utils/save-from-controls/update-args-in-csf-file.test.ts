/* eslint-disable no-underscore-dangle */
import { describe, test, expect } from 'vitest';
import { readCsf, printCsf } from '@storybook/csf-tools';
import { join } from 'path';
import { getProjectRoot } from '@storybook/core-common';

import { updateArgsInCsfFile } from './update-args-in-csf-file';
import { readFile } from 'fs/promises';

const makeTitle = (userTitle: string) => userTitle;

const FILES = {
  tab: join(getProjectRoot(), 'code/ui/components/src/components/tabs/tabs.stories.tsx'),
};

// console.log(FILES);

describe('success', () => {
  test('should return success', async () => {
    const before = await readFile(FILES.tab, 'utf-8');
    const CSF = await readCsf(FILES.tab, { makeTitle });

    const parsed = CSF.parse();
    const names = Object.keys(parsed._stories);
    const nodes = names.map((name) => CSF.getStoryExport(name));

    updateArgsInCsfFile(nodes[0], { active: true, selected: 'test1' });

    const after = printCsf(parsed);

    expect(after.code).not.toBe(before);
  });
});
