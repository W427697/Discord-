import React, { ComponentProps, FunctionComponent, MouseEvent, useState } from 'react';
import { styled } from '@storybook/theming';
import { document, window } from 'global';
import memoize from 'memoizerific';

import js from 'refractor/lang/javascript';
import jsx from 'refractor/lang/jsx';
import jsExtra from 'refractor/lang/js-extras';
// @ts-ignore
import jsTemplates from 'refractor/lang/js-templates';
import jsDoc from 'refractor/lang/jsdoc';
import bash from 'refractor/lang/bash';
import graphql from 'refractor/lang/graphql';
import css from 'refractor/lang/css';
import cssExtra from 'refractor/lang/css-extras';
import json from 'refractor/lang/json';
import json5 from 'refractor/lang/json5';
import regex from 'refractor/lang/regex';
import html from 'refractor/lang/markup';
import md from 'refractor/lang/markdown';
import yml from 'refractor/lang/yaml';
import tsx from 'refractor/lang/tsx';
import typescript from 'refractor/lang/typescript';

// @ts-ignore
import ReactSyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism-light';
// @ts-ignore
import createElement from 'react-syntax-highlighter/dist/cjs/create-element';

import { ActionBar } from '../ActionBar/ActionBar';
import { ScrollArea } from '../ScrollArea/ScrollArea';

import { formatter } from './formatter';

export { createElement as createSyntaxHighlighterElement };

ReactSyntaxHighlighter.registerLanguage('js', js);
ReactSyntaxHighlighter.registerLanguage('jsx', jsx);
ReactSyntaxHighlighter.registerLanguage('jsExtra', jsExtra);
ReactSyntaxHighlighter.registerLanguage('jsTemplates', jsTemplates);
ReactSyntaxHighlighter.registerLanguage('jsDoc', jsDoc);
ReactSyntaxHighlighter.registerLanguage('json', json);
ReactSyntaxHighlighter.registerLanguage('json5', json5);
ReactSyntaxHighlighter.registerLanguage('yml', yml);
ReactSyntaxHighlighter.registerLanguage('graphql', graphql);
ReactSyntaxHighlighter.registerLanguage('md', md);
ReactSyntaxHighlighter.registerLanguage('regex', regex);
ReactSyntaxHighlighter.registerLanguage('bash', bash);
ReactSyntaxHighlighter.registerLanguage('css', css);
ReactSyntaxHighlighter.registerLanguage('cssExtra', cssExtra);
ReactSyntaxHighlighter.registerLanguage('html', html);
ReactSyntaxHighlighter.registerLanguage('tsx', tsx);
ReactSyntaxHighlighter.registerLanguage('typescript', typescript);

const themedSyntax = memoize(2)((theme) =>
  Object.entries(theme.code || {}).reduce((acc, [key, val]) => ({ ...acc, [`* .${key}`]: val }), {})
);

export interface WrapperProps {
  bordered?: boolean;
  padded?: boolean;
}

const Wrapper = styled.div<WrapperProps>(
  ({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    color: theme.color.defaultText,
  }),
  ({ theme, bordered }) =>
    bordered
      ? {
          border: `1px solid ${theme.appBorderColor}`,
          borderRadius: theme.borderRadius,
          background: theme.background.content,
        }
      : {}
);

const Scroller = styled(({ children, className }) => (
  <ScrollArea horizontal vertical className={className}>
    {children}
  </ScrollArea>
))(
  {
    position: 'relative',
  },
  ({ theme }) => ({
    '& code': {
      paddingRight: theme.layoutMargin,
    },
  }),
  ({ theme }) => themedSyntax(theme)
);

export interface PreProps {
  padded?: boolean;
}

const Pre = styled.pre<PreProps>(({ theme, padded }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  margin: 0,
  padding: padded ? theme.layoutMargin : 0,
}));

const Code = styled.code({
  flex: 1,
  paddingRight: 0,
  opacity: 1,
});

export interface SyntaxHighlighterRendererProps {
  rows: any[];
  stylesheet: string;
  useInlineStyles: boolean;
}
export interface SyntaxHighlighterProps {
  language: string;
  copyable?: boolean;
  bordered?: boolean;
  padded?: boolean;
  format?: boolean;
  className?: string;
  renderer?: (props: SyntaxHighlighterRendererProps) => React.ReactNode;
}

export interface SyntaxHighlighterState {
  copied: boolean;
}

type ReactSyntaxHighlighterProps = ComponentProps<typeof ReactSyntaxHighlighter>;

type Props = SyntaxHighlighterProps & ReactSyntaxHighlighterProps;
export const SyntaxHighlighter: FunctionComponent<Props> = ({
  children,
  language = 'jsx',
  copyable = false,
  bordered = false,
  padded = false,
  format = true,
  className = null,
  ...rest
}) => {
  const [copied, setCopied] = useState(false);

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const tmp = document.createElement('TEXTAREA');
    const focus = document.activeElement;

    tmp.value = children;

    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    document.body.removeChild(tmp);
    focus.focus();

    setCopied(true);

    window.setTimeout(() => setCopied(false), 1500);
  };

  return children ? (
    <Wrapper bordered={bordered} padded={padded} className={className}>
      <Scroller>
        <ReactSyntaxHighlighter
          padded={padded || bordered}
          language={language}
          useInlineStyles={false}
          PreTag={Pre}
          CodeTag={Code}
          lineNumberContainerStyle={{}}
          {...rest}
        >
          {format ? formatter((children as string).trim()) : (children as string).trim()}
        </ReactSyntaxHighlighter>
      </Scroller>

      {copyable ? (
        <ActionBar actionItems={[{ title: copied ? 'Copied' : 'Copy', onClick }]} />
      ) : null}
    </Wrapper>
  ) : null;
};
