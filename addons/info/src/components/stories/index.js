/* eslint-disable react/prop-types */

import React from 'react';

import { storiesOf, addDecorator } from '@storybook/react';
import { withInfo, setInfoOptions } from '@storybook/addon-info';
import { withKnobs, text, number } from '@storybook/addon-knobs';

import { Button } from '@storybook/react/demo';
import marksy from 'marksy';

import Story from '../Story';
import Node from '../Node';
import Props from '../Props';
import PropTable from '../PropTable';
import PropVal from '../PropVal';
import { Code, Pre, Blockquote } from '../markdown/code';
import rmkCompiler from '../markdown/compiler';

import { defaultOptions, defaultMarksyConf } from '../../defaults';
import * as mock from './mock-data';

addDecorator((story, context) =>
  withInfo({
    summary: null,
    inline: false,
    header: true,
    source: true,
    // propTables: [Story, Node, Props, PropTable, PropVal],
    propTablesExclude: [mock.Widget],
  })(story)(context)
);

addDecorator(withKnobs);

const maxPropObjectKeys = val => Math.max(number('maxPropObjectKeys', val) || 1, 1);
const maxPropArrayLength = (val = 3) => Math.max(number('maxPropArrayLength', val) || 1, 1);
const maxPropsIntoLine = (val = 3) => Math.max(number('maxPropsIntoLine', val) || 1, 1);
const maxPropStringLength = (val = 50) => Math.max(number('maxPropStringLength', val) || 1, 1);

const customOptions = {
  // maxPropStringLength: 50,
};

const options = {
  ...defaultOptions,
  ...customOptions,
};

const marksyConf = {
  ...defaultMarksyConf,
  ...options.marksyConf,
};

const props = () => ({
  summary: mock.widgetSummary,
  context: mock.context,
  showInline: Boolean(options.inline),
  showHeader: Boolean(options.header),
  showSource: Boolean(options.source),
  hideInfoButton: Boolean(!options.infoButton),
  propTables: options.propTables || null,
  propTablesExclude: options.propTablesExclude,
  styles: typeof options.styles === 'function' && options.styles,
  marksyConf,
  maxPropObjectKeys: maxPropObjectKeys(options.maxPropObjectKeys),
  maxPropArrayLength: maxPropArrayLength(options.maxPropArrayLength),
  maxPropsIntoLine: maxPropsIntoLine(options.maxPropsIntoLine),
  maxPropStringLength: maxPropStringLength(options.maxPropStringLength),
});

storiesOf('Root Info Component (Story.js)', module)
  .summary(
    `
    ### <Story />

    It's a root component of **addon-info**

    we run it in isolation with *mocked* data

    **Note**: actual components of **addon-info** are in the *preview* area.
    At the same time we use addon-info itself to see component's details.
    You can find this information in the **INFO** panel

    PR #1501 by @usulpro
  `
  )
  .add('with Widget', () =>
    <Story {...props()}>
      <mock.Widget {...mock.widgetProps} />
    </Story>
  )
  .add('with button', () =>
    <Story {...props()}>
      <button>Press me</button>
    </Story>
  );

storiesOf('Node', module)
  .summary(
    `
    ### <Node />

    It used to display the source of story

    *parent*: **<Story />**

    *section*: **Story Source**
  `
  )
  .add('info with story sourse only', () =>
    <Story
      {...props()}
      showHeader={false}
      showSource
      summary={null}
      propTablesExclude={[mock.Widget]}
    >
      <mock.Widget {...mock.widgetProps} />
    </Story>
  )
  .add('default with Widget', () =>
    <Node
      node={<mock.Widget {...mock.widgetProps} />}
      depth={0}
      maxPropsIntoLine={props().maxPropsIntoLine}
      maxPropObjectKeys={props().maxPropObjectKeys}
      maxPropArrayLength={props().maxPropArrayLength}
      maxPropStringLength={props().maxPropStringLength}
    />
  )
  .add('default with button', () =>
    <Node
      node={<button>Press Me</button>}
      depth={0}
      maxPropsIntoLine={props().maxPropsIntoLine}
      maxPropObjectKeys={props().maxPropObjectKeys}
      maxPropArrayLength={props().maxPropArrayLength}
      maxPropStringLength={props().maxPropStringLength}
    />
  );

storiesOf('Props', module)
  .summary(
    `
    ### <Props />

    It used to display all props of a component

    *parent*: **<Node />**

    *section*: **Story Source**
  `
  )
  .add('default with Widget', () =>
    <Props
      node={<mock.Widget {...mock.widgetProps} />}
      singleLine
      maxPropsIntoLine={props().maxPropsIntoLine}
      maxPropObjectKeys={props().maxPropObjectKeys}
      maxPropArrayLength={props().maxPropArrayLength}
      maxPropStringLength={props().maxPropStringLength}
    />
  )
  .add('default with button', () =>
    <Props
      node={<button>Press Me</button>}
      singleLine
      maxPropsIntoLine={props().maxPropsIntoLine}
      maxPropObjectKeys={props().maxPropObjectKeys}
      maxPropArrayLength={props().maxPropArrayLength}
      maxPropStringLength={props().maxPropStringLength}
    />
  );

storiesOf('PropTable', module)
  .summary(
    `
    ### <PropTable />

    It displays table with props description of components

    *parent*: **<Story />**

    *section*: **Prop Types**
  `
  )
  .add('info with Prop Types only', () =>
    <Story
      {...props()}
      showHeader={false}
      showSource={false}
      summary={null}
      propTables={[
        mock.Widget,
        Button,
        Story,
        Node,
        Props,
        PropTable,
        PropVal,
        Code,
        Pre,
        Blockquote,
      ]}
    >
      <mock.Widget {...mock.widgetProps} />
    </Story>
  )
  .add('default with Widget', () =>
    <PropTable
      type={mock.Widget}
      maxPropObjectKeys={props().maxPropObjectKeys}
      maxPropArrayLength={props().maxPropArrayLength}
      maxPropStringLength={props().maxPropStringLength}
    />
  )
  .add('default with Button', () =>
    <PropTable
      type={Button}
      maxPropObjectKeys={props().maxPropObjectKeys}
      maxPropArrayLength={props().maxPropArrayLength}
      maxPropStringLength={props().maxPropStringLength}
    />
  );

storiesOf('PropVal', module)
  .summary(
    `
    ### <PropVal />

    It shows default props in PropTable and prop values in Props

    *parent*: **<PropTable />**, **<Props />**

    *section*: **Prop Types**, **Story Source**
  `
  )
  .add('default', () =>
    <PropVal
      val={
        'Ipsaque parte summo, et paravi admotas te demum castique nostri, audit metuunt inquit: vestigia? Formae potius Tritonidos et pars, iungat tum, gestare, *ardore cum*, ausum inscribenda incingitur digitis umbram. Aello electarumque huic et cunctatusque et verba alto atque et ignibus'
      }
      maxPropObjectKeys={props().maxPropObjectKeys}
      maxPropArrayLength={props().maxPropArrayLength}
      maxPropStringLength={props().maxPropStringLength}
    />
  );

storiesOf('Markdown/Code', module)
  .summary('inline code sections in markdown')
  .add('info with Markdown only', () =>
    <Story
      {...props()}
      showHeader={false}
      showSource={false}
      summary={mock.markdown}
      propTablesExclude={[mock.Widget]}
    >
      <mock.Widget {...mock.widgetProps} />
    </Story>
  )
  .add('example 1', () =>
    <Code
      code={`
        import { configure, setAddon } from '@storybook/react';
        import { withInfo, setInfoOptions } from '@storybook/addon-info';
        import { setOptions } from '@storybook/addon-options';

        setOptions({
          downPanelInRight: true,
        })
      `}
      language="javascript"
    />
  )
  .add('example 2', () =>
    <Code
      code={
        <div>{`
        import { configure, setAddon } from '@storybook/react';
        import { withInfo, setInfoOptions } from '@storybook/addon-info';
        import { setOptions } from '@storybook/addon-options';

        setOptions({
          downPanelInRight: true,
        })
      `}</div>
      }
      language="javascript"
    />
  );

storiesOf('Markdown/Pre', module)
  .summary('block code sections in markdown')
  .add('example 1', () =>
    <Pre>
      <Code
        code={
          <div>{`
          import { configure, setAddon } from '@storybook/react';
          import { withInfo, setInfoOptions } from '@storybook/addon-info';
          import { setOptions } from '@storybook/addon-options';

          setOptions({
            downPanelInRight: true,
          })
        `}</div>
        }
        language="javascript"
      />
    </Pre>
  )
  .add('example 2', () =>
    <Pre>
      <Code language="javascript">
        <div>{`
        import { configure, setAddon } from '@storybook/react';
        import { withInfo, setInfoOptions } from '@storybook/addon-info';
        import { setOptions } from '@storybook/addon-options';

        setOptions({
          downPanelInRight: true,
        })
        `}</div>
      </Code>
    </Pre>
  );

storiesOf('Markdown/Blockquote', module)
  .summary('Blockquote sections in markdown')
  .add('example 1', () =>
    <Blockquote>
      <div>const A = 10;</div>
    </Blockquote>
  )
  .add('example 2', () =>
    <Blockquote>
      {'const A = 10;'}
    </Blockquote>
  );

const mdCompiler = marksy({
  // Pass in whatever creates elements for your
  // virtual DOM library. h('h1', {})
  createElement: React.createElement,

  // You can override the default elements with
  // custom VDOM trees
  elements: {
    h1({ children }) {
      return (
        <span className="my-custom-class" style={{ color: 'crimson' }}>
          {children}
        </span>
      );
    },
    h2({ children }) {
      return (
        <span className="my-custom-class-h2" style={{ color: 'coral' }}>
          {children}
        </span>
      );
    },
    code({ language, children, code }) {
      // const infoMarkup = {
      //   __html: code ? hljs.highlight('js', code).value : '',
      // };
      //  dangerouslySetInnerHTML={infoMarkup}
      return children
        ? <code
            style={{
              color: 'hsl(0, 0%, 20%)',
              border: '1px solid hsl(0, 0%, 80%)',
              borderRadius: 4,
              backgroundColor: 'hsl(0, 0%, 94%)',
              padding: 4,
              fontFamily: 'monospace',
            }}
          >
            {children}
          </code>
        : <div className="code-block" style={{ padding: 4, margin: 8 }}>
            <span className="code-language">
              language: {language}
            </span>
            <pre
              style={{
                color: 'hsl(200, 60%, 20%)',
                border: '1px solid hsl(0, 0%, 80%)',
                borderRadius: 4,
                backgroundColor: 'hsl(0, 0%, 94%)',
                padding: 4,
                fontFamily: 'monospace',
              }}
              className="pre-code-block"
            >
              <code className="language-js">
                {code}
              </code>
            </pre>
          </div>;
    },
  },
});

const mdString = `
# Hello world

lorem

## block code

ipsum

~~~js
import { configure, setAddon } from '@storybook/react';
import { withInfo, setInfoOptions } from '@storybook/addon-info';
import { setOptions } from '@storybook/addon-options';

setOptions({
  downPanelInRight: true,
})
~~~

### inline code

run \`setOptions({ downPanelInRight: true });\`


`;

const demo = `
# Some blog title

Just **need** to _show_ you @usulpro some code in #1501 PR for of \`storybook-addon\`:

1. AAAAA
2. BBBBB
3. CCCCC

- XXXXXxxxx
- YYYyyyyy
- ZZzzzzzZZZZzzzZZzz

## My awesome subtitle!!!

### Heading level 3

#### Heading level 4

##### Heading level 5

\`\`\`js
import { configure, setAddon } from '@storybook/react';
import { withInfo, setInfoOptions } from '@storybook/addon-info';
import { setOptions } from '@storybook/addon-options';

setOptions({
    downPanelInRight: true,
})

const props = () => ({
    summary: mock.widgetSummary,
    context: mock.context,
    showInline: Boolean(options.inline),
    showHeader: Boolean(options.header),
    showSource: Boolean(options.source),
    hideInfoButton: Boolean(!options.infoButton),
    propTables: options.propTables || null,
    propTablesExclude: options.propTablesExclude,
    styles: typeof options.styles === 'function' && options.styles,
    marksyConf,
    maxPropObjectKeys: maxPropObjectKeys(),
    maxPropArrayLength: maxPropArrayLength(options.maxPropArrayLength),
    maxPropsIntoLine: maxPropsIntoLine(options.maxPropsIntoLine),
    maxPropStringLength: maxPropStringLength(options.maxPropStringLength),
});
\`\`\`

<Row>
<Col>Need to tell you something over here</Col>
<Col>And over here</Col>
</Row>
`;

storiesOf('Markdown/marksy', module)
  .summary('Direct compile with marksy')
  .add('example 1', () =>
    <div>
      {mdCompiler(demo).tree}
    </div>
  )
  .add('example 2 toc', () =>
    <div>
      {mdCompiler(mdString).tree}
    </div>
  );

storiesOf('Markdown/remark', module)
  .add('example 1', () => rmkCompiler(demo))
  .add('example 2', () => rmkCompiler(mdString));

storiesOf('Mock Components', module)
  .add('Widget with text', () => {
    setInfoOptions({ summary: mock.widgetSummary, propTables: [mock.Widget] });
    return <mock.Widget {...mock.widgetProps} />;
  })
  .add('Widget with emoji', () => {
    setInfoOptions({ summary: mock.widgetSummary, propTables: [mock.Widget] });
    return <mock.Widget {...mock.widgetProps} isText={false} />;
  })
  .add('simple button', () => {
    setInfoOptions('simple button: `<button>click me</button>`');
    return <button>click me</button>;
  })
  .add('glamorous button', () => {
    setInfoOptions(
      'button from [@storybook/components](https://github.com/storybooks/storybook/tree/master/lib/components)'
    );
    return <Button>click me</Button>;
  });

storiesOf('Test knobs', module).add('Widget with text', () => {
  setInfoOptions({ summary: text('summary', 'hello knobs') });
  return <mock.Widget {...mock.widgetProps} />;
});
