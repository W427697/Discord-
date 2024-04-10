import { describe, test, expect } from 'vitest';
import { readCsf, babelPrint } from '@storybook/csf-tools';
import { readFile } from 'fs/promises';

describe('success', () => {
  test('should return success', async () => {
    const before = await readFile('path/to/file', 'utf-8');
    const CSF = await readCsf('path/to/file', { makeTitle: (userTitle: string) => userTitle });

    const parsed = CSF.parse();

    // parsed._stories
  });
});
