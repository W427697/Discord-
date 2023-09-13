import dedent from 'ts-dedent';
import { transformCode } from './plugin';

// describe('unplugin-nextjs', () => {
//   it('no component', () => {
const namedImport = dedent`
  import { Meta } from '@storybook/react';
  import { Button } from './Button';
  export default {
    title: 'Button',
    component: Button,
  };
  export const Basic = {};
  `;
const defaultImport = dedent`
  import { Meta } from '@storybook/react';
  import Button from './Button';
  export default {
    title: 'Button',
    component: Button,
  };
  export const Basic = {};
  `;
const multiImport = dedent`
import { Meta } from '@storybook/react';
import Button, { helper } from './Button';
export default {
  title: 'Button',
  component: Button,
};
export const Basic = {};
`;
const satisfiesType = dedent`
  import { Meta } from '@storybook/react';
  import Button from './Button';
  const meta = {
    title: 'Button',
    component: Button,
  } satisfies Meta<typeof Button>;
  
  export default meta;
  type Story = Story<typeof meta>;
  export const Basic = {};
  `;
const output = transformCode(satisfiesType, {});
// @ts-expect-error - TS doesn't know about the sourceMaps option
console.log(output.code);
// expect(output).toMatchInlineSnapshot();
//   });
// });
