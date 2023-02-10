import { describe, expect, it } from '@jest/globals';
import dedent from 'ts-dedent';
import { transform } from '../mdx-to-csf';

expect.addSnapshotSerializer({
  print: (val: any) => val,
  test: () => true,
});

describe('mdx-to-csf', () => {
  it('rewrite import', () => {
    const input = dedent`
      import { Meta, Story } from '@storybook/addon-docs';
    `;

    const [mdx] = transform(input, 'Foobar.stories.mdx');

    expect(mdx).toMatchInlineSnapshot(`
      import { Meta, Story } from '@storybook/blocks';
      import * as FoobarStories from './Foobar.stories';

    `);
  });

  it('drop invalid story nodes', () => {
    const input = dedent`
      import { Meta } from '@storybook/addon-docs';

      <Meta title="Foobar" />
      
      <Story>No name!</Story>  
    `;

    const [mdx] = transform(input, 'Foobar.stories.mdx');

    expect(mdx).toMatchInlineSnapshot(`
      import { Meta } from '@storybook/blocks';
      import * as FoobarStories from './Foobar.stories';

      <Meta of={FoobarStories} />


    `);
  });

  it('convert correct story nodes', () => {
    const input = dedent`
      import { Meta, Story } from '@storybook/addon-docs';

      <Meta title="Foobar" />
      
      <Story name="Primary">Story</Story>
    `;

    const [mdx] = transform(input, 'Foobar.stories.mdx');
    expect(mdx).toMatchInlineSnapshot(`
      import { Meta, Story } from '@storybook/blocks';
      import * as FoobarStories from './Foobar.stories';

      <Meta of={FoobarStories} />

      <Story of={FoobarStories.Primary} />

    `);
  });

  it('extract esm into csf head code', () => {
    const input = dedent`
      import { Meta, Story } from '@storybook/addon-docs';

      # hello

      export const args = { bla: 1 };
      
      <Meta title="foobar" />

      world {2 + 1}

      <Story name="foo">bar</Story>
      
      <Story 
        name="Unchecked"
        args={{
          ...args,
          label: 'Unchecked',
        }}>
        {Template.bind({})}
      </Story>
    `;

    const [mdx, csf, newFileName] = transform(input, 'Foobar.stories.mdx');
    expect(mdx).toMatchInlineSnapshot(`
      import { Meta, Story } from '@storybook/blocks';
      import * as FoobarStories from './Foobar.stories';

      # hello

      export const args = { bla: 1 };

      <Meta of={FoobarStories} />

      world {2 + 1}

      <Story of={FoobarStories.Foo} />

      <Story of={FoobarStories.Unchecked} />

    `);

    expect(csf).toMatchInlineSnapshot(`
      const args = { bla: 1 };

      export default {
        title: 'foobar',
      };

      export const Foo = {
        render: () => 'bar',
        name: 'foo',
      };

      export const Unchecked = {
        render: Template.bind({}),
        name: 'Unchecked',

        args: {
          ...args,
          label: 'Unchecked',
        },
      };

    `);

    expect(newFileName).toMatchInlineSnapshot(`Foobar.stories.tsx`);
  });

  it('extract all meta parameters', () => {
    const input = dedent`
      import { Meta } from '@storybook/addon-docs';

      export const args = { bla: 1 };
      
      <Meta title="foobar" args={{...args}} parameters={{a: '1'}} />
    `;

    const [, csf] = transform(input, 'Foobar.stories.mdx');

    expect(csf).toMatchInlineSnapshot(`
      const args = { bla: 1 };

      export default {
        title: 'foobar',

        args: {
          ...args,
        },

        parameters: {
          a: '1',
        },
      };

    `);
  });

  it('extract all story attributes', () => {
    const input = dedent`
      import { Meta, Story } from '@storybook/addon-docs';

      export const args = { bla: 1 };
      
      <Meta title="foobar" />

      <Story name="foo">bar</Story>
      
      <Story 
        name="Unchecked"
        args={{
          ...args,
          label: 'Unchecked',
        }}>    
        {Template.bind({})}
      </Story>
    `;

    const [, csf] = transform(input, 'Foobar.stories.mdx');

    expect(csf).toMatchInlineSnapshot(`
      const args = { bla: 1 };

      export default {
        title: 'foobar',
      };

      export const Foo = {
        render: () => 'bar',
        name: 'foo',
      };

      export const Unchecked = {
        render: Template.bind({}),
        name: 'Unchecked',

        args: {
          ...args,
          label: 'Unchecked',
        },
      };

    `);
  });

  it('story child is jsx', () => {
    const input = dedent`
      import { Canvas, Meta, Story } from '@storybook/addon-docs';
      import { Button } from './button';
      
      <Story name="Primary">
        <Button>
          <div>Hello!</div>
        </Button>
      </Story>
    `;

    const [, csf] = transform(input, 'Foobar.stories.mdx');

    expect(csf).toMatchInlineSnapshot(`
      import { Button } from './button';
      export default {};

      export const Primary = {
        render: () => (
          <Button>
            <div>Hello!</div>
          </Button>
        ),

        name: 'Primary',
      };

    `);
  });

  it('story child is arrow function', () => {
    const input = dedent`
      import { Canvas, Meta, Story } from '@storybook/addon-docs';
      import { Button } from './button';
      
      <Story name="Primary">
        {(args) => <Button />}
      </Story>
    `;

    const [, csf] = transform(input, 'Foobar.stories.mdx');

    expect(csf).toMatchInlineSnapshot(`
      import { Button } from './button';
      export default {};

      export const Primary = {
        render: (args) => <Button />,
        name: 'Primary',
      };

    `);
  });

  it('story child is identifier', () => {
    const input = dedent`
      import { Canvas, Meta, Story } from '@storybook/addon-docs';
      import { Button } from './button';
      
      <Story name="Primary">
        {Button}
      </Story>
    `;

    const [, csf] = transform(input, 'Foobar.stories.mdx');

    expect(csf).toMatchInlineSnapshot(`
      import { Button } from './button';
      export default {};

      export const Primary = {
        render: Button,
        name: 'Primary',
      };

    `);
  });
});
