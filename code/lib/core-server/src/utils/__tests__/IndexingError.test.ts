import { IndexingError, formatIndexingErrors } from '../IndexingError';

it('formats single file errors', () => {
  const sourceError = new Error('parse error');
  const error = new IndexingError(sourceError.message, sourceError.stack, [
    '/path/to/some/File.stories.ts',
  ]);

  expect(error.toString()).toMatchInlineSnapshot(`"/path/to/some/File.stories.ts: parse error"`);
});

it('formats multi file errors', () => {
  const sourceError = new Error('Duplicate stories');
  const error = new IndexingError(sourceError.message, sourceError.stack, [
    '/path/to/some/File.stories.ts',
    '/path/to/other/File.stories.ts',
  ]);

  expect(error.toString()).toMatchInlineSnapshot(
    `"/path/to/some/File.stories.ts,/path/to/other/File.stories.ts: Duplicate stories"`
  );
});

describe('formatIndexingErrors', () => {
  it('formats one error with trace', () => {
    const stack = `Error: parse error
          at Object.<anonymous> (/user/storybookjs/storybook/code/lib/core-server/src/utils/__tests__/IndexingError.test.ts:26:25)
          at Promise.then.completed (/user/storybookjs/storybook/code/node_modules/jest-circus/build/utils.js:293:28)
          at new Promise (<anonymous>)`;
    const error = new IndexingError('parse error', stack, ['/path/to/some/File.stories.ts']);

    expect(formatIndexingErrors([error])).toMatchInlineSnapshot(`
      "🚨 Unable to index /path/to/some/File.stories.ts: 
        Error: parse error
                at Object.<anonymous> (/user/storybookjs/storybook/code/lib/core-server/src/utils/__tests__/IndexingError.test.ts:26:25)
                at Promise.then.completed (/user/storybookjs/storybook/code/node_modules/jest-circus/build/utils.js:293:28)
                at new Promise (<anonymous>)"
    `);
  });

  it('formats multiple errors without trace', () => {
    const errors = [0, 1, 2].map((index) => {
      const sourceError = new Error('parse error');
      return new IndexingError(sourceError.message, sourceError.stack, [
        `/path/to/some/File-${index}.stories.ts`,
      ]);
    });

    expect(formatIndexingErrors(errors)).toMatchInlineSnapshot(`
      "🚨 Unable to index files:
      - /path/to/some/File-0.stories.ts: parse error
      - /path/to/some/File-1.stories.ts: parse error
      - /path/to/some/File-2.stories.ts: parse error"
    `);
  });
});
