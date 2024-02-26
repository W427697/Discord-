import { expect, test, vi } from 'vitest';
import transform from '../migrate-to-test-package';
import dedent from 'ts-dedent';

vi.mock('prettier', async (importOriginal) => {
  const mod = await importOriginal<typeof import('prettier')>();

  return {
    ...mod,
    resolveConfig: vi.fn().mockResolvedValue({
      printWidth: 100,
      tabWidth: 2,
      bracketSpacing: true,
      trailingComma: 'es5',
      singleQuote: true,
      parser: 'babel-ts',
    }),
  };
});

expect.addSnapshotSerializer({
  serialize: (val: any) => (typeof val === 'string' ? val : val.toString()),
  test: () => true,
});

const tsTransform = async (source: string) =>
  (await transform({ source, path: 'Component.stories.tsx' })).trim();

test('replace jest and testing-library with the test package', async () => {
  const input = dedent`
    import { expect } from '@storybook/jest';
    import { within, userEvent } from '@storybook/testing-library';
  `;

  expect(await tsTransform(input)).toMatchInlineSnapshot(`
    import { expect } from '@storybook/test';
    import { within, userEvent } from '@storybook/test';
  `);
});

test('Make jest imports namespace imports', async () => {
  const input = dedent`
    import { expect, jest } from '@storybook/jest';
    import { within, userEvent } from '@storybook/testing-library';
    
    const onFocusMock = jest.fn();
    const onSearchMock = jest.fn();

    jest.spyOn(window, 'Something');
  `;

  expect(await tsTransform(input)).toMatchInlineSnapshot(`
    import { expect } from '@storybook/test';
    import * as test from '@storybook/test';
    import { within, userEvent } from '@storybook/test';

    const onFocusMock = test.fn();
    const onSearchMock = test.fn();

    test.spyOn(window, 'Something');
  `);
});
