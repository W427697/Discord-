import { withReset } from '@storybook/components';
import type { CSSObject } from '@storybook/theming';
import { styled } from '@storybook/theming';
import { transparentize } from 'polished';
import type { FC } from 'react';
import React from 'react';

const breakpoint = 600;

export interface DocsPageProps {
  title: string;
  subtitle?: string;
}

export const Title = styled.h1(withReset, ({ theme }) => ({
  color: theme.color.defaultText,
  fontSize: theme.typography.size.m3,
  fontWeight: theme.typography.weight.black,
  lineHeight: '32px',

  [`@media (min-width: ${breakpoint}px)`]: {
    fontSize: theme.typography.size.l1,
    lineHeight: '36px',
    marginBottom: '.5rem', // 8px
  },
}));

export const Subtitle = styled.h2(withReset, ({ theme }) => ({
  fontWeight: theme.typography.weight.regular,
  fontSize: theme.typography.size.s3,
  lineHeight: '20px',
  borderBottom: 'none',
  marginBottom: 15,

  [`@media (min-width: ${breakpoint}px)`]: {
    fontSize: theme.typography.size.m1,
    lineHeight: '28px',
    marginBottom: 24,
  },

  color: transparentize(0.25, theme.color.defaultText),
}));

export const DocsContent = styled.div({
  maxWidth: 1000,
  width: '100%',
});

export const DocsWrapper = styled.div(({ theme }) => {
  const reset = {
    fontFamily: theme.typography.fonts.base,
    fontSize: theme.typography.size.s3,
    margin: 0,

    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
    WebkitOverflowScrolling: 'touch' as CSSObject['WebkitOverflowScrolling'],
  };

  return {
    background: theme.background.content,
    display: 'flex',
    justifyContent: 'center',
    padding: '4rem 20px',
    minHeight: '100vh',
    boxSizing: 'border-box',

    [`@media (min-width: ${breakpoint}px)`]: {},
    ...reset,
    'div:not(.sb-story > div)': reset,
    'a:not(.sb-story > a)': {
      ...reset,
      fontSize: 'inherit',
      lineHeight: '24px',

      color: theme.color.secondary,
      textDecoration: 'none',
      '&.absent': {
        color: '#cc0000',
      },
      '&.anchor': {
        display: 'block',
        paddingLeft: 30,
        marginLeft: -30,
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
      },
    },
  };
});

interface DocsPageWrapperProps {
  children?: React.ReactNode;
}

export const DocsPageWrapper: FC<DocsPageWrapperProps> = ({ children }) => (
  <DocsWrapper>
    <DocsContent>{children}</DocsContent>
  </DocsWrapper>
);
