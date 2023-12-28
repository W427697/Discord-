import { expect, describe, it } from 'vitest';
import { dedent } from 'ts-dedent';
import prettier from 'prettier';
import { compileSync, compile } from './index';

expect.addSnapshotSerializer({
  serialize: (val: any) => (typeof val === 'string' ? val : val.toString()),
  test: (val) => true,
});

const clean = (mdx: string) => {
  const code = compileSync(mdx);

  return prettier
    .format(code, {
      parser: 'babel',
      printWidth: 100,
      tabWidth: 2,
      bracketSpacing: true,
      trailingComma: 'es5',
      singleQuote: true,
    })
    .trim();
};

describe('mdx2', () => {
  it('works', () => {
    const input = dedent`
      # hello

      <Meta title="foobar" />

      world {2 + 1}

      <Story name="foo">bar</Story>
    `;

    expect(clean(input)).toMatchInlineSnapshot(`
      import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      function _createMdxContent(props) {
        const _components = {
            h1: 'h1',
            p: 'p',
            ..._provideComponents(),
            ...props.components,
          },
          { Meta, Story } = _components;
        if (!Meta) _missingMdxReference('Meta', true);
        if (!Story) _missingMdxReference('Story', true);
        return _jsxs(_Fragment, {
          children: [
            _jsx(_components.h1, {
              children: 'hello',
            }),
            '\\n',
            _jsx(Meta, {
              title: 'foobar',
            }),
            '\\n',
            _jsxs(_components.p, {
              children: ['world ', 2 + 1],
            }),
            '\\n',
            _jsx(Story, {
              name: 'foo',
              children: 'bar',
            }),
          ],
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
      function _missingMdxReference(id, component) {
        throw new Error(
          'Expected ' +
            (component ? 'component' : 'object') +
            ' \`' +
            id +
            '\` to be defined: you likely forgot to import, pass, or provide it.'
        );
      }
    `);
  });

  it('standalone jsx expressions', () => {
    expect(
      clean(dedent`
        # Standalone JSX expressions

        {3 + 3}
      `)
    ).toMatchInlineSnapshot(`
      import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      function _createMdxContent(props) {
        const _components = {
          h1: 'h1',
          ..._provideComponents(),
          ...props.components,
        };
        return _jsxs(_Fragment, {
          children: [
            _jsx(_components.h1, {
              children: 'Standalone JSX expressions',
            }),
            '\\n',
            3 + 3,
          ],
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
    `);
  });
});

describe('full snapshots', () => {
  it('compileSync', () => {
    const input = dedent`
      # hello

      <Meta title="foobar" />

      world {2 + 1}

      <Story name="foo">bar</Story>
    `;

    expect(compileSync(input)).toMatchInlineSnapshot(`
      import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
      import {useMDXComponents as _provideComponents} from "@mdx-js/react";
      function _createMdxContent(props) {
        const _components = {
          h1: "h1",
          p: "p",
          ..._provideComponents(),
          ...props.components
        }, {Meta, Story} = _components;
        if (!Meta) _missingMdxReference("Meta", true);
        if (!Story) _missingMdxReference("Story", true);
        return _jsxs(_Fragment, {
          children: [_jsx(_components.h1, {
            children: "hello"
          }), "\\n", _jsx(Meta, {
            title: "foobar"
          }), "\\n", _jsxs(_components.p, {
            children: ["world ", 2 + 1]
          }), "\\n", _jsx(Story, {
            name: "foo",
            children: "bar"
          })]
        });
      }
      export default function MDXContent(props = {}) {
        const {wrapper: MDXLayout} = {
          ..._provideComponents(),
          ...props.components
        };
        return MDXLayout ? _jsx(MDXLayout, {
          ...props,
          children: _jsx(_createMdxContent, {
            ...props
          })
        }) : _createMdxContent(props);
      }
      function _missingMdxReference(id, component) {
        throw new Error("Expected " + (component ? "component" : "object") + " \`" + id + "\` to be defined: you likely forgot to import, pass, or provide it.");
      }
    `);
  });
  it('compile', async () => {
    const input = dedent`
      # hello

      <Meta title="foobar" />

      world {2 + 1}

      <Story name="foo">bar</Story>
    `;
    expect(await compile(input)).toMatchInlineSnapshot(`
      import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
      import {useMDXComponents as _provideComponents} from "@mdx-js/react";
      function _createMdxContent(props) {
        const _components = {
          h1: "h1",
          p: "p",
          ..._provideComponents(),
          ...props.components
        }, {Meta, Story} = _components;
        if (!Meta) _missingMdxReference("Meta", true);
        if (!Story) _missingMdxReference("Story", true);
        return _jsxs(_Fragment, {
          children: [_jsx(_components.h1, {
            children: "hello"
          }), "\\n", _jsx(Meta, {
            title: "foobar"
          }), "\\n", _jsxs(_components.p, {
            children: ["world ", 2 + 1]
          }), "\\n", _jsx(Story, {
            name: "foo",
            children: "bar"
          })]
        });
      }
      export default function MDXContent(props = {}) {
        const {wrapper: MDXLayout} = {
          ..._provideComponents(),
          ...props.components
        };
        return MDXLayout ? _jsx(MDXLayout, {
          ...props,
          children: _jsx(_createMdxContent, {
            ...props
          })
        }) : _createMdxContent(props);
      }
      function _missingMdxReference(id, component) {
        throw new Error("Expected " + (component ? "component" : "object") + " \`" + id + "\` to be defined: you likely forgot to import, pass, or provide it.");
      }
    `);
  });
  it('sync & async should match', async () => {
    const input = dedent`
    # hello

    <Meta title="foobar" />

    world {2 + 1}

    <Story name="foo">bar</Story>
  `;

    const ou1 = compileSync(input);
    const ou2 = await compile(input);

    expect(ou1).toEqual(ou2);
  });

  it('canvas with story', () => {
    const input = dedent`
      import { Canvas, Meta, Story } from '@storybook/addon-docs';

      <Meta title="MDX/Badge" />

      <Canvas>
        <Story name="foo">
          <div>I'm a story</div>
        </Story>
      </Canvas>
    `;
    expect(compileSync(input)).toMatchInlineSnapshot(`
      import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
      import {useMDXComponents as _provideComponents} from "@mdx-js/react";
      import {Canvas, Meta, Story} from '@storybook/addon-docs';
      function _createMdxContent(props) {
        return _jsxs(_Fragment, {
          children: [_jsx(Meta, {
            title: "MDX/Badge"
          }), "\\n", _jsx(Canvas, {
            children: _jsx(Story, {
              name: "foo",
              children: _jsx("div", {
                children: "I'm a story"
              })
            })
          })]
        });
      }
      export default function MDXContent(props = {}) {
        const {wrapper: MDXLayout} = {
          ..._provideComponents(),
          ...props.components
        };
        return MDXLayout ? _jsx(MDXLayout, {
          ...props,
          children: _jsx(_createMdxContent, {
            ...props
          })
        }) : _createMdxContent(props);
      }
    `);
  });

  it('canvas without story children', () => {
    const input = dedent`
      import { Canvas } from '@storybook/addon-docs';

      <Canvas>
        <h2>Some here</h2>
      </Canvas>
    `;
    expect(compileSync(input)).toMatchInlineSnapshot(`
      import {jsx as _jsx} from "react/jsx-runtime";
      import {useMDXComponents as _provideComponents} from "@mdx-js/react";
      import {Canvas} from '@storybook/addon-docs';
      function _createMdxContent(props) {
        return _jsx(Canvas, {
          children: _jsx("h2", {
            children: "Some here"
          })
        });
      }
      export default function MDXContent(props = {}) {
        const {wrapper: MDXLayout} = {
          ..._provideComponents(),
          ...props.components
        };
        return MDXLayout ? _jsx(MDXLayout, {
          ...props,
          children: _jsx(_createMdxContent, {
            ...props
          })
        }) : _createMdxContent(props);
      }
    `);
  });
});

describe('docs-mdx-compiler-plugin', () => {
  it('component-args.mdx', () => {
    expect(
      clean(dedent`
        import { Button } from '@storybook/react/demo';
        import { Story, Meta } from '@storybook/addon-docs';

        <Meta title="Button" args={{ a: 1, b: 2 }} argTypes={{ a: { name: 'A' }, b: { name: 'B' } }} />

        # Args

        <Story name="component notes">
          <Button>Component notes</Button>
        </Story>
      `)
    ).toMatchInlineSnapshot(`
      import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      import { Button } from '@storybook/react/demo';
      import { Story, Meta } from '@storybook/addon-docs';
      function _createMdxContent(props) {
        const _components = {
          h1: 'h1',
          ..._provideComponents(),
          ...props.components,
        };
        return _jsxs(_Fragment, {
          children: [
            _jsx(Meta, {
              title: 'Button',
              args: {
                a: 1,
                b: 2,
              },
              argTypes: {
                a: {
                  name: 'A',
                },
                b: {
                  name: 'B',
                },
              },
            }),
            '\\n',
            _jsx(_components.h1, {
              children: 'Args',
            }),
            '\\n',
            _jsx(Story, {
              name: 'component notes',
              children: _jsx(Button, {
                children: 'Component notes',
              }),
            }),
          ],
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
    `);
  });

  it('component-id.mdx', () => {
    expect(
      clean(dedent`
        import { Button } from '@storybook/react/demo';
        import { Story, Meta } from '@storybook/addon-docs';

        <Meta title="Button" component={Button} id="button-id" />

        <Story name="component notes">
          <Button>Component notes</Button>
        </Story>
      `)
    ).toMatchInlineSnapshot(`
      import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      import { Button } from '@storybook/react/demo';
      import { Story, Meta } from '@storybook/addon-docs';
      function _createMdxContent(props) {
        return _jsxs(_Fragment, {
          children: [
            _jsx(Meta, {
              title: 'Button',
              component: Button,
              id: 'button-id',
            }),
            '\\n',
            _jsx(Story, {
              name: 'component notes',
              children: _jsx(Button, {
                children: 'Component notes',
              }),
            }),
          ],
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
    `);
  });

  it('csf-imports.mdx', () => {
    expect(
      clean(dedent`
        import { Story, Meta, Canvas } from '@storybook/addon-docs';
        import { Welcome, Button } from '@storybook/angular/demo';
        import * as MyStories from './My.stories';
        import { Other } from './Other.stories';

        <Meta title="MDX/CSF imports" />

        # Stories from CSF imports

        <Story story={MyStories.Basic} />

        <Canvas>
          <Story story={Other} />
        </Canvas>

        <Story name="renamed" story={MyStories.Foo} />
      `)
    ).toMatchInlineSnapshot(`
      import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      import { Story, Meta, Canvas } from '@storybook/addon-docs';
      import { Welcome, Button } from '@storybook/angular/demo';
      import * as MyStories from './My.stories';
      import { Other } from './Other.stories';
      function _createMdxContent(props) {
        const _components = {
          h1: 'h1',
          ..._provideComponents(),
          ...props.components,
        };
        return _jsxs(_Fragment, {
          children: [
            _jsx(Meta, {
              title: 'MDX/CSF imports',
            }),
            '\\n',
            _jsx(_components.h1, {
              children: 'Stories from CSF imports',
            }),
            '\\n',
            _jsx(Story, {
              story: MyStories.Basic,
            }),
            '\\n',
            _jsx(Canvas, {
              children: _jsx(Story, {
                story: Other,
              }),
            }),
            '\\n',
            _jsx(Story, {
              name: 'renamed',
              story: MyStories.Foo,
            }),
          ],
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
    `);
  });

  it('decorators.mdx', () => {
    expect(
      clean(dedent`
        import { Button } from '@storybook/react/demo';
        import { Story, Meta } from '@storybook/addon-docs';

        <Meta
          title="Button"
          decorators={[(storyFn) => <div style={{ backgroundColor: 'yellow' }}>{storyFn()}</div>]}
        />

        # Decorated story

        <Story name="one" decorators={[(storyFn) => <div className="local">{storyFn()}</div>]}>
          <Button>One</Button>
        </Story>
      `)
    ).toMatchInlineSnapshot(`
      import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      import { Button } from '@storybook/react/demo';
      import { Story, Meta } from '@storybook/addon-docs';
      function _createMdxContent(props) {
        const _components = {
          div: 'div',
          h1: 'h1',
          ..._provideComponents(),
          ...props.components,
        };
        return _jsxs(_Fragment, {
          children: [
            _jsx(Meta, {
              title: 'Button',
              decorators: [
                (storyFn) =>
                  _jsx(_components.div, {
                    style: {
                      backgroundColor: 'yellow',
                    },
                    children: storyFn(),
                  }),
              ],
            }),
            '\\n',
            _jsx(_components.h1, {
              children: 'Decorated story',
            }),
            '\\n',
            _jsx(Story, {
              name: 'one',
              decorators: [
                (storyFn) =>
                  _jsx(_components.div, {
                    className: 'local',
                    children: storyFn(),
                  }),
              ],
              children: _jsx(Button, {
                children: 'One',
              }),
            }),
          ],
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
    `);
  });

  it('docs-only.mdx', () => {
    expect(
      clean(dedent`
        import { Meta } from '@storybook/addon-docs';

        <Meta title="docs-only" />

        # Documentation only

        This is a documentation-only MDX file which cleans a dummy 'docsOnly: true' story.
      `)
    ).toMatchInlineSnapshot(`
      import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      import { Meta } from '@storybook/addon-docs';
      function _createMdxContent(props) {
        const _components = {
          h1: 'h1',
          p: 'p',
          ..._provideComponents(),
          ...props.components,
        };
        return _jsxs(_Fragment, {
          children: [
            _jsx(Meta, {
              title: 'docs-only',
            }),
            '\\n',
            _jsx(_components.h1, {
              children: 'Documentation only',
            }),
            '\\n',
            _jsx(_components.p, {
              children:
                "This is a documentation-only MDX file which cleans a dummy 'docsOnly: true' story.",
            }),
          ],
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
    `);
  });

  it('loaders.mdx', () => {
    expect(
      clean(dedent`
        import { Button } from '@storybook/react/demo';
        import { Story, Meta } from '@storybook/addon-docs';

        <Meta title="Button" loaders={[async () => ({ foo: 1 })]} />

        # Story with loader

        <Story name="one" loaders={[async () => ({ bar: 2 })]}>
          <Button>One</Button>
        </Story>
      `)
    ).toMatchInlineSnapshot(`
      import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      import { Button } from '@storybook/react/demo';
      import { Story, Meta } from '@storybook/addon-docs';
      function _createMdxContent(props) {
        const _components = {
          h1: 'h1',
          ..._provideComponents(),
          ...props.components,
        };
        return _jsxs(_Fragment, {
          children: [
            _jsx(Meta, {
              title: 'Button',
              loaders: [
                async () => ({
                  foo: 1,
                }),
              ],
            }),
            '\\n',
            _jsx(_components.h1, {
              children: 'Story with loader',
            }),
            '\\n',
            _jsx(Story, {
              name: 'one',
              loaders: [
                async () => ({
                  bar: 2,
                }),
              ],
              children: _jsx(Button, {
                children: 'One',
              }),
            }),
          ],
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
    `);
  });

  it('meta-quotes-in-title.mdx', () => {
    expect(
      clean(dedent`
        import { Meta } from '@storybook/addon-docs';

        <Meta title="Addons/Docs/what's in a title?" />
      `)
    ).toMatchInlineSnapshot(`
      import { jsx as _jsx } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      import { Meta } from '@storybook/addon-docs';
      function _createMdxContent(props) {
        return _jsx(Meta, {
          title: "Addons/Docs/what's in a title?",
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
    `);
  });

  it('non-story-exports.mdx', () => {
    expect(
      clean(dedent`
        import { Button } from '@storybook/react/demo';
        import { Story, Meta } from '@storybook/addon-docs';

        <Meta title="Button" />

        # Story definition

        <Story name="one">
          <Button>One</Button>
        </Story>

        export const two = 2;

        <Story name="hello story">
          <Button>Hello button</Button>
        </Story>
      `)
    ).toMatchInlineSnapshot(`
      import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      import { Button } from '@storybook/react/demo';
      import { Story, Meta } from '@storybook/addon-docs';
      export const two = 2;
      function _createMdxContent(props) {
        const _components = {
          h1: 'h1',
          ..._provideComponents(),
          ...props.components,
        };
        return _jsxs(_Fragment, {
          children: [
            _jsx(Meta, {
              title: 'Button',
            }),
            '\\n',
            _jsx(_components.h1, {
              children: 'Story definition',
            }),
            '\\n',
            _jsx(Story, {
              name: 'one',
              children: _jsx(Button, {
                children: 'One',
              }),
            }),
            '\\n',
            '\\n',
            _jsx(Story, {
              name: 'hello story',
              children: _jsx(Button, {
                children: 'Hello button',
              }),
            }),
          ],
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
    `);
  });

  it('parameters.mdx', () => {
    expect(
      clean(dedent`
        import { Button } from '@storybook/react/demo';
        import { Story, Meta } from '@storybook/addon-docs';

        <Meta title="Button" component={Button} parameters={{ notes: 'component notes' }} />

        <Story name="component notes">
          <Button>Component notes</Button>
        </Story>

        <Story name="story notes" parameters={{ notes: 'story notes' }}>
          <Button>Story notes</Button>
        </Story>
      `)
    ).toMatchInlineSnapshot(`
      import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      import { Button } from '@storybook/react/demo';
      import { Story, Meta } from '@storybook/addon-docs';
      function _createMdxContent(props) {
        return _jsxs(_Fragment, {
          children: [
            _jsx(Meta, {
              title: 'Button',
              component: Button,
              parameters: {
                notes: 'component notes',
              },
            }),
            '\\n',
            _jsx(Story, {
              name: 'component notes',
              children: _jsx(Button, {
                children: 'Component notes',
              }),
            }),
            '\\n',
            _jsx(Story, {
              name: 'story notes',
              parameters: {
                notes: 'story notes',
              },
              children: _jsx(Button, {
                children: 'Story notes',
              }),
            }),
          ],
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
    `);
  });

  it('previews.mdx', () => {
    expect(
      clean(dedent`
        import { Button } from '@storybook/react/demo';
        import { Canvas, Story, Meta } from '@storybook/addon-docs';

        <Meta title="Button" component={Button} parameters={{ notes: 'component notes' }} />

        # Canvas

        Canvases can contain normal components, stories, and story references

        <Canvas>
          <Button>Just a button</Button>
          <Story name="hello button">
            <Button>Hello button</Button>
          </Story>
          <Story name="two">
            <Button>Two</Button>
          </Story>
          <Story id="welcome--welcome" />
        </Canvas>

        Canvas without a story

        <Canvas>
          <Button>Just a button</Button>
        </Canvas>
      `)
    ).toMatchInlineSnapshot(`
      import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      import { Button } from '@storybook/react/demo';
      import { Canvas, Story, Meta } from '@storybook/addon-docs';
      function _createMdxContent(props) {
        const _components = {
          h1: 'h1',
          p: 'p',
          ..._provideComponents(),
          ...props.components,
        };
        return _jsxs(_Fragment, {
          children: [
            _jsx(Meta, {
              title: 'Button',
              component: Button,
              parameters: {
                notes: 'component notes',
              },
            }),
            '\\n',
            _jsx(_components.h1, {
              children: 'Canvas',
            }),
            '\\n',
            _jsx(_components.p, {
              children: 'Canvases can contain normal components, stories, and story references',
            }),
            '\\n',
            _jsxs(Canvas, {
              children: [
                _jsx(Button, {
                  children: 'Just a button',
                }),
                _jsx(Story, {
                  name: 'hello button',
                  children: _jsx(Button, {
                    children: 'Hello button',
                  }),
                }),
                _jsx(Story, {
                  name: 'two',
                  children: _jsx(Button, {
                    children: 'Two',
                  }),
                }),
                _jsx(Story, {
                  id: 'welcome--welcome',
                }),
              ],
            }),
            '\\n',
            _jsx(_components.p, {
              children: 'Canvas without a story',
            }),
            '\\n',
            _jsx(Canvas, {
              children: _jsx(Button, {
                children: 'Just a button',
              }),
            }),
          ],
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
    `);
  });

  it('story-args.mdx', () => {
    expect(
      clean(dedent`
        import { Button } from '@storybook/react/demo';
        import { Story, Meta } from '@storybook/addon-docs';

        <Meta title="Button" />

        # Args

        export const Template = (args) => <Button>Component notes</Button>;

        <Story
          name="component notes"
          args={{ a: 1, b: 2 }}
          argTypes={{ a: { name: 'A' }, b: { name: 'B' } }}
        >
          {Template.bind({})}
        </Story>
      `)
    ).toMatchInlineSnapshot(`
      import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      import { Button } from '@storybook/react/demo';
      import { Story, Meta } from '@storybook/addon-docs';
      export const Template = (args) =>
        _jsx(Button, {
          children: 'Component notes',
        });
      function _createMdxContent(props) {
        const _components = {
          h1: 'h1',
          ..._provideComponents(),
          ...props.components,
        };
        return _jsxs(_Fragment, {
          children: [
            _jsx(Meta, {
              title: 'Button',
            }),
            '\\n',
            _jsx(_components.h1, {
              children: 'Args',
            }),
            '\\n',
            '\\n',
            _jsx(Story, {
              name: 'component notes',
              args: {
                a: 1,
                b: 2,
              },
              argTypes: {
                a: {
                  name: 'A',
                },
                b: {
                  name: 'B',
                },
              },
              children: Template.bind({}),
            }),
          ],
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
    `);
  });

  it('story-current.mdx', () => {
    expect(
      clean(dedent`
        import { Story } from '@storybook/addon-docs';

        # Current story

        <Story id="." />
      `)
    ).toMatchInlineSnapshot(`
      import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      import { Story } from '@storybook/addon-docs';
      function _createMdxContent(props) {
        const _components = {
          h1: 'h1',
          ..._provideComponents(),
          ...props.components,
        };
        return _jsxs(_Fragment, {
          children: [
            _jsx(_components.h1, {
              children: 'Current story',
            }),
            '\\n',
            _jsx(Story, {
              id: '.',
            }),
          ],
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
    `);
  });

  it('story-def-text-only.mdx', () => {
    expect(
      clean(dedent`
        import { Story, Meta } from '@storybook/addon-docs';

        <Meta title="Text" />

        # Story definition

        <Story name="text">Plain text</Story>
      `)
    ).toMatchInlineSnapshot(`
      import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      import { Story, Meta } from '@storybook/addon-docs';
      function _createMdxContent(props) {
        const _components = {
          h1: 'h1',
          ..._provideComponents(),
          ...props.components,
        };
        return _jsxs(_Fragment, {
          children: [
            _jsx(Meta, {
              title: 'Text',
            }),
            '\\n',
            _jsx(_components.h1, {
              children: 'Story definition',
            }),
            '\\n',
            _jsx(Story, {
              name: 'text',
              children: 'Plain text',
            }),
          ],
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
    `);
  });

  it('story-definitions.mdx', () => {
    expect(
      clean(dedent`
        import { Button } from '@storybook/react/demo';
        import { Story, Meta } from '@storybook/addon-docs';

        <Meta title="Button" />

        # Story definition

        <Story name="one">
          <Button>One</Button>
        </Story>

        <Story name="hello story">
          <Button>Hello button</Button>
        </Story>

        <Story name="w/punctuation">
          <Button>with punctuation</Button>
        </Story>

        <Story name="1 fine day">
          <Button>starts with number</Button>
        </Story>
      `)
    ).toMatchInlineSnapshot(`
      import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      import { Button } from '@storybook/react/demo';
      import { Story, Meta } from '@storybook/addon-docs';
      function _createMdxContent(props) {
        const _components = {
          h1: 'h1',
          ..._provideComponents(),
          ...props.components,
        };
        return _jsxs(_Fragment, {
          children: [
            _jsx(Meta, {
              title: 'Button',
            }),
            '\\n',
            _jsx(_components.h1, {
              children: 'Story definition',
            }),
            '\\n',
            _jsx(Story, {
              name: 'one',
              children: _jsx(Button, {
                children: 'One',
              }),
            }),
            '\\n',
            _jsx(Story, {
              name: 'hello story',
              children: _jsx(Button, {
                children: 'Hello button',
              }),
            }),
            '\\n',
            _jsx(Story, {
              name: 'w/punctuation',
              children: _jsx(Button, {
                children: 'with punctuation',
              }),
            }),
            '\\n',
            _jsx(Story, {
              name: '1 fine day',
              children: _jsx(Button, {
                children: 'starts with number',
              }),
            }),
          ],
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
    `);
  });

  it('story-function-var.mdx', () => {
    expect(
      clean(dedent`
        import { Meta, Story } from '@storybook/addon-docs';

        <Meta title="story-function-var" />

        export const basicFn = () => <Button />;

        # Button

        I can define a story with the function defined in CSF:

        <Story name="basic">{basicFn}</Story>
      `)
    ).toMatchInlineSnapshot(`
      import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      import { Meta, Story } from '@storybook/addon-docs';
      export const basicFn = () => {
        const { Button } = _provideComponents() || {};
        if (!Button) _missingMdxReference('Button', true);
        return _jsx(Button, {});
      };
      function _createMdxContent(props) {
        const _components = {
          h1: 'h1',
          p: 'p',
          ..._provideComponents(),
          ...props.components,
        };
        return _jsxs(_Fragment, {
          children: [
            _jsx(Meta, {
              title: 'story-function-var',
            }),
            '\\n',
            '\\n',
            _jsx(_components.h1, {
              children: 'Button',
            }),
            '\\n',
            _jsx(_components.p, {
              children: 'I can define a story with the function defined in CSF:',
            }),
            '\\n',
            _jsx(Story, {
              name: 'basic',
              children: basicFn,
            }),
          ],
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
      function _missingMdxReference(id, component) {
        throw new Error(
          'Expected ' +
            (component ? 'component' : 'object') +
            ' \`' +
            id +
            '\` to be defined: you likely forgot to import, pass, or provide it.'
        );
      }
    `);
  });

  it('story-function.mdx', () => {
    expect(
      clean(dedent`
        <Story name="function" height="100px">
          {() => {
            const btn = document.createElement('button');
            btn.innerHTML = 'Hello Button';
            btn.addEventListener('click', action('Click'));
            return btn;
          }}
        </Story>
      `)
    ).toMatchInlineSnapshot(`
      import { jsx as _jsx } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      function _createMdxContent(props) {
        const { Story } = {
          ..._provideComponents(),
          ...props.components,
        };
        if (!Story) _missingMdxReference('Story', true);
        return _jsx(Story, {
          name: 'function',
          height: '100px',
          children: () => {
            const btn = document.createElement('button');
            btn.innerHTML = 'Hello Button';
            btn.addEventListener('click', action('Click'));
            return btn;
          },
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
      function _missingMdxReference(id, component) {
        throw new Error(
          'Expected ' +
            (component ? 'component' : 'object') +
            ' \`' +
            id +
            '\` to be defined: you likely forgot to import, pass, or provide it.'
        );
      }
    `);
  });

  it('story-multiple-children.mdx', () => {
    expect(
      clean(dedent`
        import { Story, Meta } from '@storybook/addon-docs';

        <Meta title="Multiple" />

        # Multiple children

        <Story name="multiple children">
          <p>Hello Child #1</p>
          <p>Hello Child #2</p>
        </Story>
      `)
    ).toMatchInlineSnapshot(`
      import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      import { Story, Meta } from '@storybook/addon-docs';
      function _createMdxContent(props) {
        const _components = {
          h1: 'h1',
          ..._provideComponents(),
          ...props.components,
        };
        return _jsxs(_Fragment, {
          children: [
            _jsx(Meta, {
              title: 'Multiple',
            }),
            '\\n',
            _jsx(_components.h1, {
              children: 'Multiple children',
            }),
            '\\n',
            _jsxs(Story, {
              name: 'multiple children',
              children: [
                _jsx('p', {
                  children: 'Hello Child #1',
                }),
                _jsx('p', {
                  children: 'Hello Child #2',
                }),
              ],
            }),
          ],
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
    `);
  });

  it('story-object.mdx', () => {
    expect(
      clean(dedent`
        import { Story, Meta } from '@storybook/addon-docs';
        import { Welcome, Button } from '@storybook/angular/demo';
        import { linkTo } from '@storybook/addon-links';

        <Meta title="MDX|Welcome" />

        # Story object

        <Story name="to storybook" height="300px">
          {{
            template: '<storybook-welcome-component (showApp)="showApp()"></storybook-welcome-component>',
            props: {
              showApp: linkTo('Button'),
            },
            moduleMetadata: {
              declarations: [Welcome],
            },
          }}
        </Story>
      `)
    ).toMatchInlineSnapshot(`
      import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      import { Story, Meta } from '@storybook/addon-docs';
      import { Welcome, Button } from '@storybook/angular/demo';
      import { linkTo } from '@storybook/addon-links';
      function _createMdxContent(props) {
        const _components = {
          h1: 'h1',
          ..._provideComponents(),
          ...props.components,
        };
        return _jsxs(_Fragment, {
          children: [
            _jsx(Meta, {
              title: 'MDX|Welcome',
            }),
            '\\n',
            _jsx(_components.h1, {
              children: 'Story object',
            }),
            '\\n',
            _jsx(Story, {
              name: 'to storybook',
              height: '300px',
              children: {
                template:
                  '<storybook-welcome-component (showApp)="showApp()"></storybook-welcome-component>',
                props: {
                  showApp: linkTo('Button'),
                },
                moduleMetadata: {
                  declarations: [Welcome],
                },
              },
            }),
          ],
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
    `);
  });

  it('story-references.mdx', () => {
    expect(
      clean(dedent`
        import { Story } from '@storybook/addon-docs';

        # Story reference

        <Story id="welcome--welcome" />
      `)
    ).toMatchInlineSnapshot(`
      import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      import { Story } from '@storybook/addon-docs';
      function _createMdxContent(props) {
        const _components = {
          h1: 'h1',
          ..._provideComponents(),
          ...props.components,
        };
        return _jsxs(_Fragment, {
          children: [
            _jsx(_components.h1, {
              children: 'Story reference',
            }),
            '\\n',
            _jsx(Story, {
              id: 'welcome--welcome',
            }),
          ],
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
    `);
  });

  it('title-template-string.mdx', () => {
    expect(
      clean(
        [
          "import { Meta, Story } from '@storybook/addon-docs';",
          "import { titleFunction } from '../title-generators';",
          '',
          // eslint-disable-next-line no-template-curly-in-string
          "<Meta title={`${titleFunction('template')}`} />",
        ].join('\n')
      )
    ).toMatchInlineSnapshot(`
      import { jsx as _jsx } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      import { Meta, Story } from '@storybook/addon-docs';
      import { titleFunction } from '../title-generators';
      function _createMdxContent(props) {
        return _jsx(Meta, {
          title: \`\${titleFunction('template')}\`,
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
    `);
  });

  it('vanilla.mdx', () => {
    expect(
      clean(dedent`
        import { Button } from '@storybook/react/demo';

        # Hello MDX

        This is some random content.

        <Button>Hello button</Button>
      `)
    ).toMatchInlineSnapshot(`
      import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      import { Button } from '@storybook/react/demo';
      function _createMdxContent(props) {
        const _components = {
          h1: 'h1',
          p: 'p',
          ..._provideComponents(),
          ...props.components,
        };
        return _jsxs(_Fragment, {
          children: [
            _jsx(_components.h1, {
              children: 'Hello MDX',
            }),
            '\\n',
            _jsx(_components.p, {
              children: 'This is some random content.',
            }),
            '\\n',
            _jsx(Button, {
              children: 'Hello button',
            }),
          ],
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
    `);
  });

  describe('csf3', () => {
    it('auto-title-docs-only.mdx', () => {
      expect(
        clean(dedent`
          import { Meta } from '@storybook/addon-docs';

          <Meta />

          # Auto-title Docs Only

          Spme **markdown** here!
        `)
      ).toMatchInlineSnapshot(`
        import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
        import { useMDXComponents as _provideComponents } from '@mdx-js/react';
        import { Meta } from '@storybook/addon-docs';
        function _createMdxContent(props) {
          const _components = {
            h1: 'h1',
            p: 'p',
            strong: 'strong',
            ..._provideComponents(),
            ...props.components,
          };
          return _jsxs(_Fragment, {
            children: [
              _jsx(Meta, {}),
              '\\n',
              _jsx(_components.h1, {
                children: 'Auto-title Docs Only',
              }),
              '\\n',
              _jsxs(_components.p, {
                children: [
                  'Spme ',
                  _jsx(_components.strong, {
                    children: 'markdown',
                  }),
                  ' here!',
                ],
              }),
            ],
          });
        }
        export default function MDXContent(props = {}) {
          const { wrapper: MDXLayout } = {
            ..._provideComponents(),
            ...props.components,
          };
          return MDXLayout
            ? _jsx(MDXLayout, {
                ...props,
                children: _jsx(_createMdxContent, {
                  ...props,
                }),
              })
            : _createMdxContent(props);
        }
      `);
    });

    it('auto-title.mdx', () => {
      expect(
        clean(dedent`
          import { Button } from '@storybook/react/demo';
          import { Story, Meta } from '@storybook/addon-docs';

          <Meta component={Button} />

          <Story name="Basic">
            <Button>Basic</Button>
          </Story>
        `)
      ).toMatchInlineSnapshot(`
        import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
        import { useMDXComponents as _provideComponents } from '@mdx-js/react';
        import { Button } from '@storybook/react/demo';
        import { Story, Meta } from '@storybook/addon-docs';
        function _createMdxContent(props) {
          return _jsxs(_Fragment, {
            children: [
              _jsx(Meta, {
                component: Button,
              }),
              '\\n',
              _jsx(Story, {
                name: 'Basic',
                children: _jsx(Button, {
                  children: 'Basic',
                }),
              }),
            ],
          });
        }
        export default function MDXContent(props = {}) {
          const { wrapper: MDXLayout } = {
            ..._provideComponents(),
            ...props.components,
          };
          return MDXLayout
            ? _jsx(MDXLayout, {
                ...props,
                children: _jsx(_createMdxContent, {
                  ...props,
                }),
              })
            : _createMdxContent(props);
        }
      `);
    });

    it('default-render.mdx', () => {
      expect(
        clean(dedent`
          import { Button } from '@storybook/react/demo';
          import { Story, Meta } from '@storybook/addon-docs';

          <Meta title="Button" component={Button} />

          <Story name="Basic" />
        `)
      ).toMatchInlineSnapshot(`
        import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
        import { useMDXComponents as _provideComponents } from '@mdx-js/react';
        import { Button } from '@storybook/react/demo';
        import { Story, Meta } from '@storybook/addon-docs';
        function _createMdxContent(props) {
          return _jsxs(_Fragment, {
            children: [
              _jsx(Meta, {
                title: 'Button',
                component: Button,
              }),
              '\\n',
              _jsx(Story, {
                name: 'Basic',
              }),
            ],
          });
        }
        export default function MDXContent(props = {}) {
          const { wrapper: MDXLayout } = {
            ..._provideComponents(),
            ...props.components,
          };
          return MDXLayout
            ? _jsx(MDXLayout, {
                ...props,
                children: _jsx(_createMdxContent, {
                  ...props,
                }),
              })
            : _createMdxContent(props);
        }
      `);
    });

    it('component-render.mdx', () => {
      expect(
        clean(dedent`
          import { Button } from '@storybook/react/demo';
          import { Story, Meta } from '@storybook/addon-docs';

          <Meta title="Button" component={Button} render={(args) => <Button {...args} />} />

          <Story name="Basic" />
        `)
      ).toMatchInlineSnapshot(`
        import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
        import { useMDXComponents as _provideComponents } from '@mdx-js/react';
        import { Button } from '@storybook/react/demo';
        import { Story, Meta } from '@storybook/addon-docs';
        function _createMdxContent(props) {
          return _jsxs(_Fragment, {
            children: [
              _jsx(Meta, {
                title: 'Button',
                component: Button,
                render: (args) =>
                  _jsx(Button, {
                    ...args,
                  }),
              }),
              '\\n',
              _jsx(Story, {
                name: 'Basic',
              }),
            ],
          });
        }
        export default function MDXContent(props = {}) {
          const { wrapper: MDXLayout } = {
            ..._provideComponents(),
            ...props.components,
          };
          return MDXLayout
            ? _jsx(MDXLayout, {
                ...props,
                children: _jsx(_createMdxContent, {
                  ...props,
                }),
              })
            : _createMdxContent(props);
        }
      `);
    });

    it('story-render.mdx', () => {
      expect(
        clean(dedent`
          import { Button } from '@storybook/react/demo';
          import { Story, Meta } from '@storybook/addon-docs';

          <Meta title="Button" component={Button} />

          <Story name="Basic" render={(args) => <Button {...args} />} />
        `)
      ).toMatchInlineSnapshot(`
        import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
        import { useMDXComponents as _provideComponents } from '@mdx-js/react';
        import { Button } from '@storybook/react/demo';
        import { Story, Meta } from '@storybook/addon-docs';
        function _createMdxContent(props) {
          return _jsxs(_Fragment, {
            children: [
              _jsx(Meta, {
                title: 'Button',
                component: Button,
              }),
              '\\n',
              _jsx(Story, {
                name: 'Basic',
                render: (args) =>
                  _jsx(Button, {
                    ...args,
                  }),
              }),
            ],
          });
        }
        export default function MDXContent(props = {}) {
          const { wrapper: MDXLayout } = {
            ..._provideComponents(),
            ...props.components,
          };
          return MDXLayout
            ? _jsx(MDXLayout, {
                ...props,
                children: _jsx(_createMdxContent, {
                  ...props,
                }),
              })
            : _createMdxContent(props);
        }
      `);
    });

    it('story-play.mdx', () => {
      expect(
        clean(dedent`
          import { Button } from '@storybook/react/demo';
          import { Story, Meta } from '@storybook/addon-docs';

          <Meta title="Button" component={Button} />

          <Story name="Basic" play={() => console.log('play')} />
        `)
      ).toMatchInlineSnapshot(`
        import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
        import { useMDXComponents as _provideComponents } from '@mdx-js/react';
        import { Button } from '@storybook/react/demo';
        import { Story, Meta } from '@storybook/addon-docs';
        function _createMdxContent(props) {
          return _jsxs(_Fragment, {
            children: [
              _jsx(Meta, {
                title: 'Button',
                component: Button,
              }),
              '\\n',
              _jsx(Story, {
                name: 'Basic',
                play: () => console.log('play'),
              }),
            ],
          });
        }
        export default function MDXContent(props = {}) {
          const { wrapper: MDXLayout } = {
            ..._provideComponents(),
            ...props.components,
          };
          return MDXLayout
            ? _jsx(MDXLayout, {
                ...props,
                children: _jsx(_createMdxContent, {
                  ...props,
                }),
              })
            : _createMdxContent(props);
        }
      `);
    });
  });

  it('style tag', () => {
    expect(
      clean(dedent`
        import { Meta } from '@storybook/addon-docs';

        <Meta title="Example/Introduction" />

        <style>{\`
          .subheading {
            --mediumdark: '#999999';
            font-weight: 900;
            font-size: 13px;
            color: #999;
            letter-spacing: 6px;
            line-height: 24px;
            text-transform: uppercase;
            margin-bottom: 12px;
            margin-top: 40px;
          }
          .link-list {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr;
            row-gap: 10px;
          }
        \`}</style>
      `)
    ).toMatchInlineSnapshot(`
      import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
      import { useMDXComponents as _provideComponents } from '@mdx-js/react';
      import { Meta } from '@storybook/addon-docs';
      function _createMdxContent(props) {
        return _jsxs(_Fragment, {
          children: [
            _jsx(Meta, {
              title: 'Example/Introduction',
            }),
            '\\n',
            _jsx('style', {
              children: \`
        .subheading {
          --mediumdark: '#999999';
          font-weight: 900;
          font-size: 13px;
          color: #999;
          letter-spacing: 6px;
          line-height: 24px;
          text-transform: uppercase;
          margin-bottom: 12px;
          margin-top: 40px;
        }
        .link-list {
          display: grid;
          grid-template-columns: 1fr;
          grid-template-rows: 1fr 1fr;
          row-gap: 10px;
        }
      \`,
            }),
          ],
        });
      }
      export default function MDXContent(props = {}) {
        const { wrapper: MDXLayout } = {
          ..._provideComponents(),
          ...props.components,
        };
        return MDXLayout
          ? _jsx(MDXLayout, {
              ...props,
              children: _jsx(_createMdxContent, {
                ...props,
              }),
            })
          : _createMdxContent(props);
      }
    `);
  });
});
