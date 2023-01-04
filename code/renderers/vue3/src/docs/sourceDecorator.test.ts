import { describe, expect, test } from '@jest/globals';
import type { Args } from '@storybook/types';
import { generateSource } from './sourceDecorator';

expect.addSnapshotSerializer({
  print: (val: any) => val,
  test: (val: unknown) => typeof val === 'string',
});

function generateForArgs(args: Args, slotProps: string[] | null = null) {
  return generateSource({ name: 'Component' }, args, {}, slotProps);
}
function generateMultiComponentForArgs(args: Args, slotProps: string[] | null = null) {
  return generateSource([{ name: 'Component' }, { name: 'Component' }], args, {}, slotProps);
}

describe('generateSource Vue3', () => {
  test('boolean true', () => {
    expect(generateForArgs({ booleanProp: true })).toMatchInlineSnapshot(
      `<Component :booleanProp="booleanProp"/>`
    );
  });
  test('boolean false', () => {
    expect(generateForArgs({ booleanProp: false })).toMatchInlineSnapshot(
      `<Component :booleanProp="booleanProp"/>`
    );
  });
  test('null property', () => {
    expect(generateForArgs({ nullProp: null })).toMatchInlineSnapshot(
      `<Component :nullProp="nullProp"/>`
    );
  });
  test('string property', () => {
    expect(generateForArgs({ stringProp: 'mystr' })).toMatchInlineSnapshot(
      `<Component :stringProp="stringProp"/>`
    );
  });
  test('number property', () => {
    expect(generateForArgs({ numberProp: 42 })).toMatchInlineSnapshot(
      `<Component :numberProp="numberProp"/>`
    );
  });
  test('object property', () => {
    expect(generateForArgs({ objProp: { x: true } })).toMatchInlineSnapshot(
      `<Component :objProp="objProp"/>`
    );
  });
  test('multiple properties', () => {
    expect(generateForArgs({ a: 1, b: 2 })).toMatchInlineSnapshot(`<Component :a="a" :b="b"/>`);
  });
  test('1 slot property', () => {
    expect(generateForArgs({ content: 'xyz', myProp: 'abc' }, ['content'])).toMatchInlineSnapshot(`
      <Component :myProp="myProp">
      {{ content }}
      </Component>
    `);
  });
  test('multiple slot property with second slot value not set', () => {
    expect(generateForArgs({ content: 'xyz', myProp: 'abc' }, ['content', 'footer']))
      .toMatchInlineSnapshot(`
      <Component :myProp="myProp">
        <template #content> {{ content }} </template>
      </Component>
    `);
  });
  test('multiple slot property with second slot value is set', () => {
    expect(generateForArgs({ content: 'xyz', footer: 'foo', myProp: 'abc' }, ['content', 'footer']))
      .toMatchInlineSnapshot(`
      <Component :myProp="myProp">
        <template #content> {{ content }} </template>
        <template #footer> {{ footer }} </template>
      </Component>
    `);
  });
  // test mutil components
  test('mutil component with boolean true', () => {
    expect(generateMultiComponentForArgs({ booleanProp: true })).toMatchInlineSnapshot(
      `<Component :booleanProp="booleanProp"/><Component :booleanProp="booleanProp"/>`
    );
  });
  test('component is not set', () => {
    expect(generateSource(null, {}, {}, null)).toBeNull();
  });
});
