/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { transform } from '@babel/core';
import TransformFontImports from './babel';

const example = `
import { Inter, Roboto } from '@next/font/google'
import localFont from '@next/font/local'

const myFont = localFont({ src: './my-font.woff2' })

const roboto = Roboto({
  weight: '400',
})

const inter = Inter({
  subsets: ['latin'],
});

const randomObj = {}
`;

it('should transform AST properly', () => {
  const { code } = transform(example, { plugins: [TransformFontImports] })!;
  expect(code).toMatchInlineSnapshot(`
    "import inter from \\"@next/font/google?Inter;{\\\\\\"subsets\\\\\\":[\\\\\\"latin\\\\\\"]}\\";
    import roboto from \\"@next/font/google?Roboto;{\\\\\\"weight\\\\\\":\\\\\\"400\\\\\\"}\\";
    import myFont from \\"@next/font/local?localFont;{\\\\\\"src\\\\\\":\\\\\\"./my-font.woff2\\\\\\"}\\";
    const randomObj = {};"
  `);
});
