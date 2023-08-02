import type { MouseEvent, ReactNode } from 'react';
import React, { forwardRef } from 'react';
import { styled } from '@storybook/theming';
import { darken } from 'polished';
import { Icon } from '../Icon/Icon';
import type { PropsOf } from '../utils/types';

export interface LinkProps<T extends React.ElementType = React.ElementType> {
  as?: T;
  children: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  icon?: ReactNode;
  onClick?: (e: MouseEvent) => void;
  withArrow?: boolean;
}

export const Link: {
  <E extends React.ElementType = 'a'>(
    props: LinkProps<E> & Omit<PropsOf<E>, keyof LinkProps>
  ): JSX.Element;
  displayName?: string;
} = forwardRef(
  ({ as, children, icon, withArrow, ...props }: LinkProps, ref: React.Ref<HTMLAnchorElement>) => {
    return (
      <StyledLink as={as} ref={ref} {...props}>
        <StyledLeft>
          {icon}
          {children}
        </StyledLeft>
        {withArrow && <Icon.ChevronRight size={8} />}
      </StyledLink>
    );
  }
);

Link.displayName = 'Link';

const StyledLink = styled.a<Omit<LinkProps, 'children'>>(({ theme, variant = 'primary' }) => ({
  display: 'inline-flex',
  gap: 4,
  alignItems: 'center',
  transition: 'all 150ms ease-out',
  textDecoration: 'none',
  lineHeight: 1,
  color: `${(() => {
    if (variant === 'primary') return theme.color.secondary;
    if (variant === 'secondary') return theme.textMutedColor;
    if (variant === 'tertiary') return theme.color.dark;
    return theme.color.secondary;
  })()}`,

  '&:hover, &:focus': {
    cursor: 'pointer',
    color: `${(() => {
      if (variant === 'primary') return darken(0.07, theme.color.secondary);
      if (variant === 'secondary') return theme.color.dark;
      if (variant === 'tertiary') return theme.color.darkest;
      return darken(0.07, theme.color.secondary);
    })()}`,
  },

  '&:active': {
    color: `${(() => {
      if (variant === 'primary') return darken(0.1, theme.color.secondary);
      if (variant === 'secondary') return theme.color.darker;
      if (variant === 'tertiary') return theme.textMutedColor;
      return darken(0.1, theme.color.secondary);
    })()}`,
  },
}));

const StyledLeft = styled.span(({ theme }) => ({
  display: 'inline-flex',
  gap: 6,
  alignItems: 'center',
  fontSize: theme.typography.size.s2 - 1,
}));
