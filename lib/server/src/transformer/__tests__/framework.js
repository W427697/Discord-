import { createExample, transform, diff, createAST } from '../__helper__/plugin-test';

import { addFrameworkParameter, detectFramework } from '../modules/framework';

describe('detectFramework', () => {
  it('should auto detect from imports', async () => {
    const example = await createExample('plain');
    const ast = await createAST(example.code);

    const result = detectFramework(ast);

    expect(result).toEqual('react');
  });
  it('should auto detect from comments', async () => {
    const example = await createExample('framework-detect/comments');
    const ast = await createAST(example.code);

    const result = detectFramework(ast);

    expect(result).toEqual('react');
  });
  it('should read from top-level storyMeta', async () => {
    const example = await createExample('framework-detect/storyMeta-topLevel');
    const ast = await createAST(example.code);

    const result = detectFramework(ast);

    expect(result).toEqual('preact');
  });
  it('should read from parameter-level storyMeta', async () => {
    const example = await createExample('framework-detect/storyMeta-parameter');
    const ast = await createAST(example.code);

    const result = detectFramework(ast);

    expect(result).toEqual('preact');
  });
});

describe('addFrameworkParameter', () => {
  it('should inject framework', async () => {
    const example = await createExample('framework-detect/nothing');
    const { formattedCode } = await transform(example.file, addFrameworkParameter('html'));

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
    const { formattedCode } = await transform(example.file, addFrameworkParameter('html'));

    expect(example.code).toEqual(formattedCode);
  });
});
