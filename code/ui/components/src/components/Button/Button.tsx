import type { ReactNode, SyntheticEvent } from 'react';
import React, { forwardRef } from 'react';
import { styled } from '@storybook/theming';
import { darken, lighten, rgba, transparentize } from 'polished';
import type { PropsOf } from '../utils/types';

// TODO after 9.0: Change the type of the children prop to string
// TODO after 9.0: Change children prop to be required

interface ButtonProps<T extends React.ElementType = React.ElementType> {
  children?: ReactNode;
  icon?: ReactNode;
  as?: T;
  size?: 'small' | 'medium';
  variant?: 'outline' | 'solid' | 'ghost';
  onClick?: (event: SyntheticEvent) => void;
  disabled?: boolean;
  active?: boolean;

  /** @deprecated This API is not used anymore. It will be removed after 9.0. */
  isLink?: boolean;
  /** @deprecated This API is not used anymore. It will be removed after 9.0. */
  primary?: boolean;
  /** @deprecated This API is not used anymore. It will be removed after 9.0. */
  secondary?: boolean;
  /** @deprecated This API is not used anymore. It will be removed after 9.0. */
  tertiary?: boolean;
  /** @deprecated This API is not used anymore. It will be removed after 9.0. */
  gray?: boolean;
  /** @deprecated This API is not used anymore. It will be removed after 9.0. */
  inForm?: boolean;
  /** @deprecated This API is not used anymore. It will be removed after 9.0. */
  small?: boolean;
  /** @deprecated This API is not used anymore. It will be removed after 9.0. */
  outline?: boolean;
  /** @deprecated This API is not used anymore. It will be removed after 9.0. */
  containsIcon?: boolean;
}

export const Button: {
  <E extends React.ElementType = 'button'>(
    props: ButtonProps<E> & Omit<PropsOf<E>, keyof ButtonProps>
  ): JSX.Element;
  displayName?: string;
} = forwardRef(
  ({ as, children, icon, ...props }: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
    let { variant, size } = props;

    // Match the old API with the new API
    // TODO: Remove this after 9.0
    if (props.primary) {
      variant = 'solid';
      size = 'medium';
    }
    if (props.secondary || props.tertiary || props.gray || props.outline || props.inForm) {
      variant = 'outline';
      size = 'medium';
    }

    return (
      <StyledButton as={as} ref={ref} variant={variant} size={size} {...props}>
        {icon}
        {children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';

const StyledButton = styled.button<Omit<ButtonProps, 'children'>>(
  ({ theme, variant = 'outline', size = 'small', disabled = false, active = false }) => ({
    border: 0,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    gap: '6px',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: `${(() => {
      if (size === 'small') return '0 10px';
      if (size === 'medium') return '0 12px';
      return 0;
    })()}`,
    height: size === 'small' ? '28px' : '32px',
    position: 'relative',
    textAlign: 'center',
    textDecoration: 'none',
    transitionProperty: 'background, box-shadow',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease-out',
    verticalAlign: 'top',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    opacity: disabled ? 0.5 : 1,
    margin: 0,
    fontSize: `${theme.typography.size.s1}px`,
    fontWeight: theme.typography.weight.bold,
    lineHeight: '1',
    background: `${(() => {
      if (variant === 'solid') return theme.color.secondary;
      if (variant === 'outline') return theme.button.background;
      if (variant === 'ghost' && active) return theme.background.hoverable;
      return 'transparent';
    })()}`,
    color: `${(() => {
      if (variant === 'solid') return theme.color.lightest;
      if (variant === 'outline') return theme.input.color;
      if (variant === 'ghost' && active) return theme.color.secondary;
      if (variant === 'ghost') return theme.color.mediumdark;
      return theme.input.color;
    })()}`,
    boxShadow: variant === 'outline' ? `${theme.button.border} 0 0 0 1px inset` : 'none',
    borderRadius: theme.input.borderRadius,

    '&:hover': {
      color: variant === 'ghost' ? theme.color.secondary : null,
      background: `${(() => {
        let bgColor = theme.color.secondary;
        if (variant === 'solid') bgColor = theme.color.secondary;
        if (variant === 'outline') bgColor = theme.button.background;

        if (variant === 'ghost') return transparentize(0.86, theme.color.secondary);
        return theme.base === 'light' ? darken(0.02, bgColor) : lighten(0.03, bgColor);
      })()}`,
    },

    '&:active': {
      color: variant === 'ghost' ? theme.color.secondary : null,
      background: `${(() => {
        let bgColor = theme.color.secondary;
        if (variant === 'solid') bgColor = theme.color.secondary;
        if (variant === 'outline') bgColor = theme.button.background;

        if (variant === 'ghost') return theme.background.hoverable;
        return theme.base === 'light' ? darken(0.02, bgColor) : lighten(0.03, bgColor);
      })()}`,
    },

    '&:focus': {
      boxShadow: `${rgba(theme.color.secondary, 1)} 0 0 0 1px inset`,
      outline: 'none',
    },
  })
);
