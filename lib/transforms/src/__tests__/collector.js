import path from 'path';
import { transform, createExample, createAST, formatCode } from '../__helper__/plugin-test';

import {
  detectSubConfigs,
  removeSubConfigRefs,
  getCorrectPath,
  collectSubConfigs,
  collector,
} from '../modules/collector';

const cacheDir = '/cacheDir';

describe('detectSubConfigs', () => {
  it('should detect addons & presets', async () => {
    const example = await createExample('collector/storybook.config.js');
    const ast = await createAST(example.code);

    const result = detectSubConfigs(ast);

    expect(result).toEqual(expect.arrayContaining(['./presets/a', './addons/a']));
  });
});

describe('removeSubConfigRefs', () => {
  it('remove the correct exports', async () => {
    const example = await createExample('collector/storybook.config.js');
    const { formattedCode } = await transform(example.file, removeSubConfigRefs());

    expect(formattedCode).toMatchInlineSnapshot(`
      "export const entries = ['*.stories.*'];
      "
    `);
  });
});

describe('getCorrectPath', () => {
  it('resolves correctly', async () => {
    const example = await createExample('collector/storybook.config.js');
    const from = example.file;
    const ref = './presets/a';

    const result = await getCorrectPath(from, ref);

    expect(result).toContain('collector/presets/a.js');
  });
  it('throws if not found', async () => {
    const example = await createExample('collector/storybook.config.js');
    const from = example.file;
    const ref = './presets/missing';

    expect(getCorrectPath(from, ref)).rejects.toThrow();
  });
});

describe('collectSubConfigs', () => {
  it('should collect from all refs in order', async () => {
    const example = await createExample('collector/storybook.config.js');

    const result = await collectSubConfigs([example.file]);

    expect(result).toEqual([
      expect.stringContaining('collector/storybook.config.js'),
      expect.stringContaining('collector/presets/a.js'),
      expect.stringContaining('collector/addons/a.js'),
      expect.stringContaining('collector/presets/b.js'),
    ]);
  });
});

describe('collector', () => {
  let result;

  const files = [
    require.resolve('../__mocks__/collector/storybook.config.js'),
    require.resolve('../__mocks__/collector/presets/a.js'),
    require.resolve('../__mocks__/collector/addons/a.js'),
    require.resolve('../__mocks__/collector/presets/b.js'),
  ];

  beforeEach(async () => {
    const output = await collector(files);
    result = formatCode(output.code);
  });

  it('should look as expected', async () => {
    expect(result).toMatchInlineSnapshot(`
      "import _used2 from 'somewhere';
      const _used = 'foo';
      export const entries = [['*.stories.*']];
      export const webpack = [
        () => {
          // preset a
          console.log(_used);
        },
        () => {
          // addon a
        },
        () => {
          // preset b
          console.log(_used2);
        },
      ];
      "
    `);
  });

  it('should have collected the exports in arrays', () => {
    expect(result).toContain('export const entries = [');
    expect(result).toContain('export const webpack = [');
  });

  it('should have added scopes from subConfigs with unique ids', () => {
    expect(result).toContain(`import _used2 from 'somewhere`);
    expect(result).toContain(`const _used = 'foo';`);
  });

  it('should have removed unused vars', () => {
    expect(result).not.toContain(`unused`);
  });
});
