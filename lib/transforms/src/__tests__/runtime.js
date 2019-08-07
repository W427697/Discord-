import { createExample, transform, diff } from '../__helper__/plugin-test';

import { addRuntime } from '../modules/runtime';

it('add runtime', async () => {
  const example = await createExample('plain');
  const { formattedCode } = await transform(example.file, addRuntime('react'));

  expect(diff(example.code, formattedCode)).toMatchInlineSnapshot(`
    "Transforms:
    - Removed
    + Added

    @@ --- --- @@
    - // main dependencies
    - import React from 'react';
    - 
    - // the storyMeta
    - export default {
    + const _storyMeta = {
        title: 'Core|Parameters',
        parameters: {
          chapterParameter: 'chapterParameter',
        },
      };
    + import { add as _add } from '@storybook/runtime'; // main dependencies
    + import React from 'react'; // the storyMeta
    + export default _storyMeta;
      
      /* CASE: regular names export */
      export const passed = () => null;
      passed.story = {
        title: 'passed to story',
    @@ --- --- @@
      export const e = () => null,
        f = () => null;
      
      /* CASE: ignored * exports */
      export * from 'foo';
    + _add('react', { module, stories: { passed, myStory, a, b, c, d, e, f }, ..._storyMeta });
      "
  `);

  expect(formattedCode).toMatch(/import \{ add.* \} from '@storybook\/runtime'/);
  expect(formattedCode).toMatch(/_add.*\(.*, { module, stories: { .* }, \.\.\._storyMeta.*\);/);
});

it('inject the provided framework', async () => {
  const example = await createExample('plain');
  const { formattedCode } = await transform(example.file, addRuntime('preact'));

  expect(formattedCode).toMatch(
    /_add.*\('preact', { module, stories: { .* }, \.\.\._storyMeta.*\);/
  );
});
