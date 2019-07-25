import { createExample, transform, diff } from '../__helper__/plugin-test';

import { addFrameworkParameter } from '../modules/framework';

it('should auto detect from imports', async () => {
  const example = await createExample('plain');
  const { formattedCode } = await transform(example.file, addFrameworkParameter);

  expect(diff(example.code, formattedCode)).toMatchInlineSnapshot(`
    "Transforms:
    - Removed
    + Added

    @@ --- --- @@
      export default {
        title: 'Core|Parameters',
        parameters: {
          chapterParameter: 'chapterParameter',
        },
    +   framework: 'react',
      };
      
      /* CASE: regular names export */
      export const passed = () => null;
      passed.story = {"
  `);

  expect(formattedCode).toContain(`framework: 'react'`);
});
it('should auto detect from comments', async () => {
  const example = await createExample('framework-detect/comments');
  const { formattedCode } = await transform(example.file, addFrameworkParameter);

  expect(diff(example.code, formattedCode)).toMatchInlineSnapshot(`
    "Transforms:
    - Removed
    + Added

    @@ --- --- @@
      export default {
        title: 'Core|Parameters',
        parameters: {
          chapterParameter: 'chapterParameter',
        },
    +   framework: 'react',
      };
      "
  `);

  expect(formattedCode).toContain(`framework: 'react'`);
});

it('should read from top-level storyMeta', async () => {
  const example = await createExample('framework-detect/storyMeta-topLevel');
  const { formattedCode } = await transform(example.file, addFrameworkParameter);

  expect(diff(example.code, formattedCode)).toMatchInlineSnapshot(`
    "Transforms:
    - Removed
    + Added

      export default {
        title: 'Core|Parameters',
        parameters: {
          chapterParameter: 'chapterParameter',
        },
    + 
        framework: 'preact',
      };
      "
  `);

  expect(formattedCode).toContain(`framework: 'preact'`);
});
it('should read from parameter-level storyMeta', async () => {
  const example = await createExample('framework-detect/storyMeta-parameter');
  const { formattedCode } = await transform(example.file, addFrameworkParameter);

  expect(diff(example.code, formattedCode)).toMatchInlineSnapshot(`
    "Transforms:
    - Removed
    + Added

      export default {
        title: 'Core|Parameters',
        parameters: {
          chapterParameter: 'chapterParameter',
    -     framework: 'preact',
        },
    +   framework: 'preact',
      };
      "
  `);

  expect(formattedCode).toContain(`framework: 'preact'`);
});

it('should put html when nothing is detected or read', async () => {
  const example = await createExample('framework-detect/nothing');
  const { formattedCode } = await transform(example.file, addFrameworkParameter);

  expect(diff(example.code, formattedCode)).toMatchInlineSnapshot(`
    "Transforms:
    - Removed
    + Added

      export default {
        title: 'Core|Parameters',
        parameters: {
          chapterParameter: 'chapterParameter',
        },
    +   framework: 'html',
      };
      "
  `);

  expect(formattedCode).toContain(`framework: 'html'`);
});

it('does nothing without default export', async () => {
  const example = await createExample('empty');
  const { formattedCode } = await transform(example.file, addFrameworkParameter);

  expect(example.code).toEqual(formattedCode);
});
