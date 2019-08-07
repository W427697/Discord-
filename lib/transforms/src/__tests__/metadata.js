import { createExample, transform, diff } from '../__helper__/plugin-test';

import { removeNonMetadata } from '../modules/metadata';

it('should remove global addParameters & addDecorators', async () => {
  const example = await createExample('metadata/withAddParameters');
  const { formattedCode } = await transform(example.file, removeNonMetadata());

  expect(diff(example.code, formattedCode)).toMatchInlineSnapshot(`
    "Transforms:
    - Removed
    + Added

      import { addParameters, addDecorator } from '@storybook/react';
      
    - addDecorator(fn => fn());
    - addParameters({
    -   foo: 4,
    - });
    - "
  `);
});

it('should replace renderFns with an object', async () => {
  const example = await createExample('metadata/esmExports');
  const { formattedCode } = await transform(example.file, removeNonMetadata());

  expect(diff(example.code, formattedCode)).toMatchInlineSnapshot(`
    "Transforms:
    - Removed
    + Added

      /* CASE: regular names export */
    - export const passed = () => null;
    + export const passed = {};
      passed.story = {
        title: 'passed to story',
        parameters: { storyParameter: 'storyParameter' },
      };
      
      /* CASE: export as */
    - const myStory = () => null;
    + const myStory = {};
      export { myStory as foo };
      
      /* CASE: object destructed exports */
    - export const { a, b, c } = { a: () => null, b: () => null, c: () => null };
    + export const { a, b, c } = { a: {}, b: {}, c: {} };
      
      /* CASE: object destructed exports, with renamed keys */
    - export const { a: a1, b: b1, c: c1 } = { a: () => null, b: () => null, c: () => null };
    + export const { a: a1, b: b1, c: c1 } = { a: {}, b: {}, c: {} };
      
      /* CASE: array destructed exports */
    - export const [d] = [() => null];
    + export const [d] = [{}];
      
      /* CASE: multiple declarations */
      // eslint-disable-next-line one-var, prettier/prettier
    - export const e = () => null,
    -   f = () => null;
    + export const e = {},
    +   f = {};
      
      /* CASE: export a function */
    - export function g() {}
    + export const g = {};
      
      /* CASE: export a class */
    - export class H {}
    + export const H = {};
      
      /* CASE: ignored * exports */
      export * from 'foo';
      "
  `);
});

it('should understand Object.assign', async () => {
  const example = await createExample('metadata/esmWrapped');
  const { formattedCode } = await transform(example.file, removeNonMetadata());

  expect(diff(example.code, formattedCode)).toMatchInlineSnapshot(`
    "Transforms:
    - Removed
    + Added

      import { story } from '@storybook/react';
      
      /* CASE: wrapped with Object.assign */
    - export const a = Object.assign(() => null, {
    + export const a = {
        title: 'A',
    - });
    + };
      
      /* CASE: wrapped with story */
    - export const b = story(() => null, {
    + export const b = {
        title: 'B',
    - });
    + };
      
      /* CASE: wrapped with story + referencing object */
      const meta = {
        title: 'B',
      };
      
    - export const c = story(() => null, meta);
    + export const c = meta;
      "
  `);
});
