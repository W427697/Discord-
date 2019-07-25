import * as t from '@babel/types';

import { createExample, transform } from '../__helper__/plugin-test';

it('when no visitors, nothing changes', async () => {
  const example = await createExample('plain');
  const { formattedCode, code, map, ast } = await transform(example.file);

  expect(code).toBeDefined();
  expect(ast).toBeDefined();
  expect(map).toBeDefined();

  expect(formattedCode).toEqual(example.code);
});

it('testing a real simple visitor', async () => {
  const example = await createExample('plain');
  const { formattedCode } = await transform(example.file, {
    Program(p) {
      p.unshiftContainer('body', t.expressionStatement(t.stringLiteral('before')));
    },
  });

  expect(formattedCode).toEqual(`'before'; ${example.code}`);
});
