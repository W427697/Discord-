import React, { Component } from 'react';
import { styled } from '@storybook/theming';
import { document, window } from 'global';
import memoize from 'memoizerific';

import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import html from 'react-syntax-highlighter/dist/esm/languages/prism/markup';

import { PrismLight as SyntaxHighlighterLight } from 'react-syntax-highlighter';

import { ActionBar } from '../ActionBar/ActionBar';
import { ScrollArea } from '../ScrollArea/ScrollArea';

import { formatter } from './formatter';

SyntaxHighlighterLight.registerLanguage('jsx', jsx);
SyntaxHighlighterLight.registerLanguage('bash', bash);
SyntaxHighlighterLight.registerLanguage('css', css);
SyntaxHighlighterLight.registerLanguage('html', html);

const themedSyntax = memoize(2)(theme =>
  Object.entries(theme.code || {}).reduce((acc, [key, val]) => ({ ...acc, [`* .${key}`]: val }), {})
);

interface WrapperProps {
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
          background: theme.background.bar,
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

interface PreProps {
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

export interface SyntaxHighlighterProps {
  language: string;
  copyable?: boolean;
  bordered?: boolean;
  padded?: boolean;
  format?: boolean;
  className?: string;
}

export interface SyntaxHighlighterState {
  copied: boolean;
}

type ReactSyntaxHighlighterProps = React.ComponentProps<typeof SyntaxHighlighterLight>;

export class SyntaxHighlighter extends Component<
  SyntaxHighlighterProps & ReactSyntaxHighlighterProps,
  SyntaxHighlighterState
> {
  static defaultProps: SyntaxHighlighterProps = {
    language: null,
    copyable: false,
    bordered: false,
    padded: false,
    format: true,
    className: null,
  };

  state = { copied: false };

  onClick = (e: React.MouseEvent) => {
    const { children } = this.props;

    e.preventDefault();
    const tmp = document.createElement('TEXTAREA');
    const focus = document.activeElement;

    tmp.value = children;

    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    document.body.removeChild(tmp);
    focus.focus();

    this.setState({ copied: true }, () => {
      window.setTimeout(() => this.setState({ copied: false }), 1500);
    });
  };

  render() {
    const {
      children,
      language = 'jsx',
      copyable,
      bordered,
      padded,
      format,
      className,
      ...rest
    } = this.props;
    const { copied } = this.state;

    return children ? (
      <Wrapper bordered={bordered} padded={padded} className={className}>
        <Scroller>
          <SyntaxHighlighterLight
            padded={padded || bordered}
            language={language}
            useInlineStyles={false}
            PreTag={Pre}
            CodeTag={Code}
            lineNumberContainerStyle={{}}
            {...rest}
          >
            {format ? formatter((children as string).trim()) : (children as string).trim()}
          </SyntaxHighlighterLight>
        </Scroller>
        {copyable ? (
          <ActionBar actionItems={[{ title: copied ? 'Copied' : 'Copy', onClick: this.onClick }]} />
        ) : null}
      </Wrapper>
    ) : null;
  }
}
