import { exec } from 'node-exec-promise';
import tempWrite from 'temp-write';

import { formatCode } from '../__helper__/plugin-test';

import { filter } from '../modules/filter';

describe('filter', () => {
  it('empty should result empty', async () => {
    const output = await filter(require.resolve('../__mocks__/collector/storybook.config.js'), []);
    const result = formatCode(output.code);

    expect(result).toMatchInlineSnapshot(`""`);

    const p = await tempWrite(result);

    const { stderr, stdout } = await exec(`node -r esm ${p}`);

    expect(stderr).toMatchInlineSnapshot(`""`);
    expect(stdout).toMatchInlineSnapshot(`""`);
  });
  it('get 1', async () => {
    const output = await filter(require.resolve('../__mocks__/collector/storybook.config.js'), [
      'entries',
    ]);
    const result = formatCode(output.code);

    expect(result).toMatchInlineSnapshot(`
      "export const entries = ['*.stories.*'];
      "
    `);

    const p = await tempWrite(result);

    const { stderr, stdout } = await exec(`node -r esm ${p}`);

    expect(stderr).toMatchInlineSnapshot(`""`);
    expect(stdout).toMatchInlineSnapshot(`""`);
  });
});
describe('dependency', () => {
  it('configs used by configs should remain', async () => {
    const output = await filter(require.resolve('../__mocks__/collector/dependency/config.js'), [
      'webpack',
    ]);
    const result = formatCode(output.code);

    expect(result).toMatchInlineSnapshot(`
      "export const entries = ['*.stories.*'];

      export const output = [{}];

      export const webpack = [
        async (base, config) => {
          const e = await config.entries;
          const o = await config.output;

          return () => ({
            entries: e,
            output: o,
          });
        },
      ];
      "
    `);
    expect(result).toContain('export const entries = ');
    expect(result).toContain('export const output = ');

    const p = await tempWrite(result);

    const { stderr, stdout } = await exec(`node -r esm ${p}`);

    expect(stderr).toMatchInlineSnapshot(`""`);
    expect(stdout).toMatchInlineSnapshot(`""`);
  });
});
