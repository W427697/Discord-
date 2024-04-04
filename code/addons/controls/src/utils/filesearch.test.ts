import { describe, expect, it } from 'vitest';
import path from 'path';
import { searchFiles } from './filesearch';

describe('filesearch', () => {
  describe('search result', () => {
    it('should automatically convert static search to a dynamic glob search', async (t) => {
      const files = await searchFiles('ommonjs', path.join(__dirname, '__tests__'), 'react');

      expect(files?.map((f) => f.filepath)).toEqual([
        'src/commonjs-module-default.js',
        'src/commonjs-module.js',
      ]);
    });

    it('should automatically convert static search to a dynamic glob search (with file extension)', async (t) => {
      const files = await searchFiles('module.js', path.join(__dirname, '__tests__'), 'react');

      expect(files?.map((f) => f.filepath)).toEqual(['src/commonjs-module.js', 'src/es-module.js']);
    });

    it('should return all files if the search query matches the parent folder', async (t) => {
      const files = await searchFiles('module', path.join(__dirname, '__tests__'), 'react');

      expect(files?.map((f) => f.filepath)).toEqual([
        'src/commonjs-module-default.js',
        'src/commonjs-module.js',
        'src/es-module.js',
      ]);
    });

    it('should ignore files that do not have the allowed extensions', async (t) => {
      const files = await searchFiles('asset', path.join(__dirname, '__tests__'), 'react');

      expect(files).toEqual([]);
    });

    it('should ignore test files (*.spec.*, *.test.*)', async (t) => {
      const files = await searchFiles('tests', path.join(__dirname, '__tests__'), 'react');

      expect(files).toEqual([]);
    });

    it('should work with glob search patterns', async (t) => {
      const files = await searchFiles(
        '**/commonjs-module.js',
        path.join(__dirname, '__tests__'),
        'react'
      );

      expect(files?.map((f) => f.filepath)).toEqual(['src/commonjs-module.js']);
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
      const files = await searchFiles(
        'commonjs-module.js',
        path.join(__dirname, '__tests__'),
        'react'
      );

      expect(files?.flatMap((f) => f.exportedComponents)).toHaveLength(5);
    });

    it('should return null for exportedComponents if parsing fails', async (t) => {
      const files = await searchFiles('no-export.js', path.join(__dirname, '__tests__'), 'react');

      expect(files).toEqual([
        {
          exportedComponents: null,
          filepath: 'src/no-export.js',
        },
      ]);
    });
  });
});
