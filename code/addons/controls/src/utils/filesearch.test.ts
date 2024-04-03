import { describe, expect, it } from 'vitest';
import path from 'path';
import { searchFiles } from './filesearch';

describe('filesearch', () => {
  describe('search result', () => {
    it('should automatically convert normal search to a glob search', async (t) => {
      const files = await searchFiles('ommonjs', path.join(__dirname, '__tests__'), 'react');

      expect(files?.map((f) => f.filepath)).toEqual(['src/commonjs-default.js', 'src/commonjs.js']);
    });

    it('should return all files if the search query matches the parent folder', async (t) => {
      const files = await searchFiles('src', path.join(__dirname, '__tests__'), 'react');

      expect(files?.map((f) => f.filepath)).toEqual([
        'src/commonjs-default.js',
        'src/commonjs.js',
        'src/esmodule.js',
      ]);
    });

    it('should work with glob search patterns', async (t) => {
      const files = await searchFiles('**/commonjs.js', path.join(__dirname, '__tests__'), 'react');

      expect(files?.map((f) => f.filepath)).toEqual(['src/commonjs.js']);
    });

    it('should ignore node_modules', async (t) => {
      const files = await searchFiles(
        'file-in-common.js',
        path.join(__dirname, '__tests__'),
        'react'
      );

      expect(files).toEqual([]);
    });
  });

  describe('exported components', () => {
    it('should correctly return the exported components', async (t) => {
      const files = await searchFiles('commonjs.js', path.join(__dirname, '__tests__'), 'react');

      expect(files?.flatMap((f) => f.exportedComponents)).toHaveLength(5);
    });
  });
});
