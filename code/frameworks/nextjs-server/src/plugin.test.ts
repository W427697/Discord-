import dedent from 'ts-dedent';
import { transformCode } from './plugin';

it('named import', () => {
  const namedImport = dedent`
      import { Meta } from '@storybook/react';
      import { Button } from './Button';
      export default {
        title: 'Button',
        component: Button,
      };
      export const Basic = {};
      `;
  expect(transformCode(namedImport, {}).code).toMatchInlineSnapshot(`
    "import { Meta } from '@storybook/react';
    export default {
      title: 'Button'
    };
    export const Basic = {};"
  `);
});
it('default import', () => {
  const defaultImport = dedent`
      import { Meta } from '@storybook/react';
      import Button from './Button';
      export default {
        title: 'Button',
        component: Button,
      };
      export const Basic = {};
      `;
  expect(transformCode(defaultImport, {}).code).toMatchInlineSnapshot(`
    "import { Meta } from '@storybook/react';
    export default {
      title: 'Button'
    };
    export const Basic = {};"
  `);
});
it('multi import', () => {
  const multiImport = dedent`
      import { Meta } from '@storybook/react';
      import Button, { helper } from './Button';
      export default {
        title: 'Button',
        component: Button,
      };
      export const Basic = {};
      `;
  expect(transformCode(multiImport, {}).code).toMatchInlineSnapshot(`
    "import { Meta } from '@storybook/react';
    import { helper } from './Button';
    export default {
      title: 'Button'
    };
    export const Basic = {};"
  `);
});
it('satisfies type', () => {
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
  expect(transformCode(satisfiesType, {}).code).toMatchInlineSnapshot(`
    "import { Meta } from '@storybook/react';
    const meta = ({
      title: 'Button'
    } satisfies Meta<any>);
    export default meta;
    type Story = Story<typeof meta>;
    export const Basic = {};"
  `);
});
