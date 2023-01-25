/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PureMarkdown from 'markdown-to-jsx';
import { components } from '@storybook/components';
import dedent from 'ts-dedent';

// mirror props from markdown-to-jsx. From https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase#wrappingmirroring-a-component
type MarkdownProps = typeof PureMarkdown extends React.ComponentType<infer Props>
  ? Props extends object
    ? Props
    : never
  : never;

export const Markdown = (props: MarkdownProps) => {
  if (!props.children) {
    return null;
  }
  if (typeof props.children !== 'string') {
    throw new Error(
      dedent`The Markdown block only accepts children as a single string, but children were of type: '${typeof props.children}'
        This is often caused by not wrapping the child in a template string.
        
        This is invalid:
        <Markdown>
          # Some heading
          A paragraph
        </Markdown>

        Instead do:
        <Markdown>
        {\`
          # Some heading
          A paragraph
        \`}
        </Markdown>
      `
    );
  }
  return (
    <PureMarkdown
      {...props}
      options={{
        forceBlock: true,
        overrides: {
          code: components.code,
          pre: components.pre,
          a: components.a,
          ...props?.options?.overrides,
        },
        ...props?.options,
      }}
    />
  );
};
