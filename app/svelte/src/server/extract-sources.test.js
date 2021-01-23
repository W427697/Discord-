import { extractStoriesSources } from './extract-sources';

describe('extractSource', () => {
  test('Simple Story', () => {
    expect(
      extractStoriesSources(`
        <script>
          import { Story } from '@storybook/svelte';
        </script>

        <Story name="MyStory">
          <div>a story</div>
        </Story>
        `)
    ).toMatchInlineSnapshot(`
      Object {
        "MyStory": Object {
          "hasArgs": false,
          "source": <div>
        a story
      </div>,
        },
      }
    `);
  });
  test('Args Story', () => {
    expect(
      extractStoriesSources(`
        <script>
          import { Story } from '@storybook/svelte';
        </script>

        <Story name="MyStory" let:args>
          <div>a story</div>
        </Story>
        `)
    ).toMatchInlineSnapshot(`
      Object {
        "MyStory": Object {
          "hasArgs": true,
          "source": <div>
        a story
      </div>,
        },
      }
    `);
  });
  test('Simple Template', () => {
    expect(
      extractStoriesSources(`
        <script>
          import { Template } from '@storybook/svelte';
        </script>

        <Template name="MyTemplate">
          <div>a template</div>
        </Template>
        `)
    ).toMatchInlineSnapshot(`
      Object {
        "tpl:MyTemplate": Object {
          "hasArgs": false,
          "source": <div>
        a template
      </div>,
        },
      }
    `);
  });
  test('Unnamed Template', () => {
    expect(
      extractStoriesSources(`
        <script>
          import { Template } from '@storybook/svelte';
        </script>

        <Template>
          <div>a template</div>
        </Template>
        `)
    ).toMatchInlineSnapshot(`
      Object {
        "tpl:default": Object {
          "hasArgs": false,
          "source": <div>
        a template
      </div>,
        },
      }
    `);
  });
  test('Multiple Stories', () => {
    expect(
      extractStoriesSources(`
        <script>
          import { Template } from '@storybook/svelte';
        </script>

        <Story name="Story1">
          <div>story 1</div>
        </Story>
        <Story name="Story2">
          <div>story 2</div>
        </Story>
        `)
    ).toMatchInlineSnapshot(`
      Object {
        "Story1": Object {
          "hasArgs": false,
          "source": <div>
        story 1
      </div>,
        },
        "Story2": Object {
          "hasArgs": false,
          "source": <div>
        story 2
      </div>,
        },
      }
    `);
  });
});
