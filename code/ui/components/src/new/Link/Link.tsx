import type { MouseEvent, ReactNode } from 'react';
import React, { forwardRef } from 'react';
import { styled } from '@storybook/theming';
import { darken } from 'polished';
import type { PropsOf } from '../utils/types';

export interface LinkProps<T extends React.ElementType = React.ElementType> {
  as?: T;
  children: string;
  size?: 'small' | 'medium';
  variant?: 'primary' | 'secondary' | 'tertiary';
  icon?: ReactNode;
  onClick?: (e: MouseEvent) => void;
  withArrow?: boolean;
  disabled?: boolean;
  active?: boolean;
}

export const Link: {
  <E extends React.ElementType = 'a'>(
    props: LinkProps<E> & Omit<PropsOf<E>, keyof LinkProps>
  ): JSX.Element;
  displayName?: string;
} = forwardRef(({ as, children, icon, ...props }: LinkProps, ref: React.Ref<HTMLAnchorElement>) => {
  return (
    <StyledLink as={as} ref={ref} {...props}>
      {icon}
      {children}
    </StyledLink>
  );
});

Link.displayName = 'Link';

const StyledLink = styled.a<Omit<LinkProps, 'children'>>(
  ({ theme, variant = 'primary', size = 'medium' }) => ({
    display: 'inline-flex',
    transition: 'all 150ms ease-out',
    textDecoration: 'none',
    color: `${(() => {
      if (variant === 'primary') return theme.color.secondary;
      if (variant === 'secondary') return theme.color.darkest;
      if (variant === 'tertiary') return theme.textMutedColor;
      return theme.color.secondary;
    })()}`,

    '&:hover, &:focus': {
      cursor: 'pointer',
      color: `${(() => {
        if (variant === 'primary') return darken(0.07, theme.color.secondary);
        if (variant === 'secondary') return theme.color.darkest;
        if (variant === 'tertiary') return theme.darkest;
        return darken(0.07, theme.color.secondary);
      })()}`,
    },

    '&:active': {
      color: `${(() => {
        if (variant === 'primary') return darken(0.1, theme.color.secondary);
        if (variant === 'secondary') return theme.color.darkest;
        if (variant === 'tertiary') return theme.textMutedColor;
        return darken(0.1, theme.color.secondary);
      })()}`,
    },
  })
);
