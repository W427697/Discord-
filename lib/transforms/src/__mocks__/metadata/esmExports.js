/* CASE: regular names export */
export const passed = () => null;
passed.story = {
  title: 'passed to story',
  parameters: { storyParameter: 'storyParameter' },
};

/* CASE: export as */
const myStory = () => null;
export { myStory as foo };

/* CASE: object destructed exports */
export const { a, b, c } = { a: () => null, b: () => null, c: () => null };

/* CASE: object destructed exports, with renamed keys */
export const { a: a1, b: b1, c: c1 } = { a: () => null, b: () => null, c: () => null };

/* CASE: array destructed exports */
export const [d] = [() => null];

/* CASE: multiple declarations */
// eslint-disable-next-line one-var, prettier/prettier
export const e = () => null, f = () => null;

/* CASE: export a function */
export function g() {}

/* CASE: export a class */
export class H {}

/* CASE: ignored * exports */
export * from 'foo';
