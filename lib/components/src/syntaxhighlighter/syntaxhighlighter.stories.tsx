import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider, themes, ensure } from '@storybook/theming';

export default {
  title: 'Basics/SyntaxHighlighter',
  loaders: [() => import('./syntaxhighlighter')],
};

const Template = (args, { loaded }) => {
  const { SyntaxHighlighter } = loaded;
  return <SyntaxHighlighter {...args} />;
};

export const Bash = Template.bind({});

Bash.args = {
  language: 'bash',
  copyable: false,
  children: `npx npm-check-updates '/storybook/' -u && npm install`,
};

export const CSS = Template.bind({});

CSS.args = {
  language: 'css',
  copyable: false,
  children: `
    .className {
      border: 1px solid hotpink;
    }
  `,
};

export const JSON = Template.bind({});

JSON.args = {
  language: 'json',
  copyable: false,
  children: `
  {
    "number": 1,
    "string": "something",
    "object": {
      "property": "value",
    },
    array: [1,2,3],
  }
  `,
};

export const Markdown = Template.bind({});

Markdown.args = {
  language: 'markdown',
  copyable: false,
  children: `
  # a big header

  some code:

  ~~~js
  const name = "a string";
  ~~~

  > crazy

  `,
};

export const YAML = Template.bind({});

YAML.args = {
  language: 'yaml',
  copyable: false,
  children: `
    product:
    - sku         : BL394D
      quantity    : 4
      description : Basketball
      price       : 450.00
  `,
};

export const JSX = Template.bind({});

JSX.args = {
  language: 'jsx',
  copyable: false,
  children: `
  import { Good, Things } from 'life';

  const result = () => <Good><Things all={true} /></Good>;

  export { result as default };
  `,
};

export const JS = Template.bind({});

JS.args = {
  language: 'jsx',
  copyable: false,
  children: `
  import React, { createElement } from 'react';
  import { Good, Things } from 'life';

  const result = () => createElement(Good, [createElement(Things, [], { all: true }), []);

  console.log(result);

  export { result as default };
  `,
};

export const GraphQL = Template.bind({});

GraphQL.args = {
  language: 'graphql',
  copyable: false,
  children: `
  query HeroNameAndFriends($episode: Episode) {
    hero(episode: $episode) {
      name
      friends {
        name
      }
    }
  }
  `,
};

export const Unsupported = Template.bind({});

Unsupported.args = {
  language: 'C#',
  bordered: true,
  copyable: true,
  children: `
  // A Hello World! program in C#.
  using System;
  namespace HelloWorld
  {
    class Hello
    {
      static void Main()
      {
        Console.WriteLine("Hello World!");

        // Keep the console window open in debug mode.
        Console.WriteLine("Press any key to exit.");
        Console.ReadKey();
      }
    }
  }
  `,
};

export const DarkUnsupported = Template.bind({});

DarkUnsupported.decorators = [
  (Story) => {
    const theme = ensure(themes.dark);
    return (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    );
  },
];

DarkUnsupported.args = {
  language: 'C#',
  bordered: true,
  copyable: true,
  children: `
  // A Hello World! program in C#.
  using System;
  namespace HelloWorld
  {
    class Hello
    {
      static void Main()
      {
        Console.WriteLine("Hello World!");

        // Keep the console window open in debug mode.
        Console.WriteLine("Press any key to exit.");
        Console.ReadKey();
      }
    }
  }
  `,
};

export const Story = Template.bind({});

Story.args = {
  language: 'jsx',
  copyable: false,
  children: `
  import React from 'react';
  import { storiesOf } from '@storybook/react';
  import { styled } from '@storybook/theming';

  import Heading from './heading';

  const Holder = styled.div({
    margin: 10,
    border: '1px dashed deepskyblue',
    // overflow: 'hidden',
  });

  storiesOf('Basics|Heading', module).add('types', () => (
    <div>
      <Holder>
        <Heading>DEFAULT WITH ALL CAPS</Heading>
      </Holder>
      <Holder>
        <Heading sub="With a great sub">THIS LONG DEFAULT WITH ALL CAPS & SUB</Heading>
      </Holder>
      <Holder>
        <Heading type="page">page type</Heading>
      </Holder>
      <Holder>
        <Heading type="page" sub="With a sub">
          page type
        </Heading>
      </Holder>
    </div>
  ));
  `,
};

export const BorderedCopyable = Template.bind({});

BorderedCopyable.args = {
  language: 'jsx',
  bordered: true,
  copyable: true,
  children: `
  import { Good, Things } from 'life';

  const result = () => <Good><Things /></Good>;

  export { result as default };
  `,
};

export const Padded = Template.bind({});

Padded.args = {
  language: 'jsx',
  padded: true,
  children: `
  import { Good, Things } from 'life';

  const result = () => <Good><Things /></Good>;

  export { result as default };
  `,
};

export const ShowLineNumbers = Template.bind({});

ShowLineNumbers.args = {
  language: 'jsx',
  copyable: false,
  showLineNumbers: true,
  children: `
  import { Good, Things } from 'life';

  const result = () => <Good><Things /></Good>;

  export { result as default };
  `,
};
