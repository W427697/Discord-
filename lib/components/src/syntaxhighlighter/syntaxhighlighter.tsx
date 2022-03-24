import React, { ClipboardEvent, FunctionComponent, MouseEvent, useCallback, useState } from 'react';
import { logger } from '@storybook/client-logger';
import type { Theme } from '@storybook/theming';
import { styled } from '@storybook/theming';
import global from 'global';
import memoize from 'memoizerific';

import Highlight, { defaultProps } from 'prism-react-renderer';
import nightTheme from 'prism-react-renderer/themes/nightOwl';
import githubTheme from 'prism-react-renderer/themes/github';

import { ActionBar } from '../ActionBar/ActionBar';
import { ScrollArea } from '../ScrollArea/ScrollArea';

import type { SyntaxHighlighterProps } from './syntaxhighlighter-types';

const { navigator, document, window: globalWindow } = global;

const themedSyntax = memoize(2)((theme: Theme) =>
  Object.entries(theme.code || {}).reduce((acc, [key, val]) => ({ ...acc, [`${key}`]: val }), {})
);

const copyToClipboard: (text: string) => Promise<void> = createCopyToClipboardFunction();

export function createCopyToClipboardFunction() {
  if (navigator?.clipboard) {
    return (text: string) => navigator.clipboard.writeText(text);
  }
  return async (text: string) => {
    const tmp = document.createElement('TEXTAREA');
    const focus = document.activeElement;

    tmp.value = text;

    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    document.body.removeChild(tmp);
    focus.focus();
  };
}

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
  })
);
const Pre = styled.pre(({ theme }) => themedSyntax(theme));
export interface PreProps {
  padded?: boolean;
}

export interface SyntaxHighlighterState {
  copied: boolean;
}

export const SyntaxHighlighter: FunctionComponent<SyntaxHighlighterProps> = ({
  children,
  language = 'jsx',
  copyable = false,
  bordered = false,
  padded = false,
  format = true,
  formatter = null,
  showLineNumbers = false,
  ...rest
}) => {
  if (typeof children !== 'string' || !children.trim()) {
    return null;
  }

  const highlightableCode = formatter ? formatter(format, children) : children.trim();
  const [copied, setCopied] = useState(false);

  const onClick = useCallback(
    (e: MouseEvent<HTMLButtonElement> | ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();

      const selectedText = globalWindow.getSelection().toString();
      const textToCopy = e.type !== 'click' && selectedText ? selectedText : highlightableCode;

      copyToClipboard(textToCopy)
        .then(() => {
          setCopied(true);
          globalWindow.setTimeout(() => setCopied(false), 1500);
        })
        .catch(logger.error);
    },
    []
  );

  return (
    <Wrapper bordered={bordered} padded={padded} {...rest}>
      <Scroller>
        <Highlight
          {...defaultProps}
          theme={githubTheme}
          code={highlightableCode}
          language={language}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={style}>
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </Scroller>

      {copyable ? (
        <ActionBar actionItems={[{ title: copied ? 'Copied' : 'Copy', onClick }]} />
      ) : null}
    </Wrapper>
  );
};

export default SyntaxHighlighter;
