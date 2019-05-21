/* eslint-disable no-useless-escape */
import fs from 'fs';
import { splitter } from '../src/index';

jest.mock('fs', () => {
  const mfs = jest.genMockFromModule('fs');

  mfs.mkdirSync = jest.fn();
  mfs.writeFile = jest.fn((l, d, fn) => fn());

  return mfs;
});

const cacheDir = '/cacheDir';

jest.mock('fs-extra', () => {
  const fse = jest.genMockFromModule('fs-extra');

  const files = {
    'storybook.config.js': `

    import path from 'path';
    import { create } from '@storybook/theming';

    export const entries = /\..*story\..*/;
    export const preview = {};
    export const manager = {};
    export const theme = create({ brandTitle: 'test' });

    export const presets = [];
    export const addons = [''];

    export const previewInit = '.storybook/config.js';
    export const managerInit = '.storybook/addons.js';

    export const unused = z => path.join('base', z);
    `,
  };

  fse.outputFile = jest.fn((location, source) => {
    files[location] = source;
    return Promise.resolve();
  });
  fse.readFile = jest.fn(fileName => {
    if (files[fileName]) {
      return Promise.resolve(files[fileName]);
    }
    return Promise.resolve('');
  });

  return fse;
});

test('splitter', async () => {
  const result = await splitter({
    file: 'storybook.config.js',
    cacheDir,
    config: {
      manager: ['entries', 'manager', 'theme'],
      preview: ['entries', 'preview'],
    },
  });

  // result should match shape
  expect(result).toMatchObject({
    manager: {
      location: expect.any(String),
      source: expect.any(String),
    },
    preview: {
      location: expect.any(String),
      source: expect.any(String),
    },
  });

  // location should be correct && source should contain correct exports only
  const { manager } = result;
  expect(manager.location).toContain('manager.config.js');
  expect(manager.source).not.toContain('import path');
  expect(manager.source).toContain('export { entries, manager, theme }');

  const { preview } = result;
  expect(preview.location).toContain('preview.config.js');
  expect(preview.source).not.toContain('import path');
  expect(preview.source).toContain('export { entries, preview }');

  // files should have been written to cacheDir
  expect(fs.writeFile).toHaveBeenCalledWith(
    '/cacheDir/manager.config.js',
    expect.any(String),
    expect.any(Function)
  );

  expect(fs.writeFile).toHaveBeenCalledWith(
    '/cacheDir/preview.config.js',
    expect.any(String),
    expect.any(Function)
  );
});

test('cacheDir', async () => {
  const result = await splitter({
    file: 'storybook.config.js',
    cacheDir: '/other',
    config: {
      manager: ['entries', 'manager', 'theme'],
      preview: ['entries', 'preview'],
    },
  });

  expect(result.manager.location).toBe('/other/manager.config.js');
});

test('default cacheDir', async () => {
  const result = await splitter({
    file: 'storybook.config.js',
    cacheDir: undefined,
    config: {
      manager: ['entries', 'manager', 'theme'],
      preview: ['entries', 'preview'],
    },
  });

  expect(result.manager.location).toBe('manager.config.js');
});

test('no cacheDir', async () => {
  const result = await splitter({
    file: 'storybook.config.js',
    cacheDir: null,
    config: {
      manager: ['entries', 'manager', 'theme'],
      preview: ['entries', 'preview'],
    },
  });

  // when null is set as cacheDir, it shouldn't save
  expect(fs.writeFile).not.toHaveBeenCalled();

  expect(result.manager.location).toBe('manager.config.js');
  expect(result.manager.source).toContain('export { entries, manager, theme }');
});

test('config', async () => {
  const result = await splitter({
    file: 'storybook.config.js',
    cacheDir: '/other',
    config: {
      manager: ['entries', 'manager', 'theme'],
      preview: ['entries', 'preview'],
      empty: [],
    },
  });

  // empty array should filter all exports, leaving an empty module
  expect(result.empty.location).toBe('/other/empty.config.js');
  expect(result.empty.source.trim()).toBe('');
});
