import { styled } from '@storybook/theming';
import { darken, lighten, rgba, transparentize } from 'polished';
import type { ButtonProps } from './Button';

type ButtonWrapperProps = Pick<
  ButtonProps,
  'variant' | 'size' | 'disabled' | 'active' | 'iconOnly'
>;

export const ButtonWrapper = styled.button<ButtonWrapperProps>(
  ({ theme, variant, size, disabled, active, iconOnly }) => ({
    border: 0,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    gap: '6px',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: `${(() => {
      if (!iconOnly && size === 'small') return '0 10px';
      if (!iconOnly && size === 'medium') return '0 12px';
      return 0;
    })()}`,
    width: `${(() => {
      if (iconOnly && size === 'small') return '28px';
      if (iconOnly && size === 'medium') return '32px';
      return 'auto';
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
      if (variant === 'primary') return theme.color.secondary;
      if (variant === 'secondary') return theme.button.background;
      if (variant === 'tertiary' && active) return theme.background.hoverable;
      return 'transparent';
    })()}`,
    color: `${(() => {
      if (variant === 'primary') return theme.color.lightest;
      if (variant === 'secondary') return theme.input.color;
      if (variant === 'tertiary' && active) return theme.color.secondary;
      if (variant === 'tertiary') return theme.color.mediumdark;
      return theme.input.color;
    })()}`,
    boxShadow: variant === 'secondary' ? `${theme.button.border} 0 0 0 1px inset` : 'none',
    borderRadius: theme.input.borderRadius,

    '&:hover': {
      color: variant === 'tertiary' ? theme.color.secondary : null,
      background: `${(() => {
        let bgColor = theme.color.secondary;
        if (variant === 'primary') bgColor = theme.color.secondary;
        if (variant === 'secondary') bgColor = theme.button.background;

        if (variant === 'tertiary') return transparentize(0.86, theme.color.secondary);
        return theme.base === 'light' ? darken(0.02, bgColor) : lighten(0.03, bgColor);
      })()}`,
    },

    '&:active': {
      color: variant === 'tertiary' ? theme.color.secondary : null,
      background: `${(() => {
        let bgColor = theme.color.secondary;
        if (variant === 'primary') bgColor = theme.color.secondary;
        if (variant === 'secondary') bgColor = theme.button.background;

        if (variant === 'tertiary') return theme.background.hoverable;
        return theme.base === 'light' ? darken(0.02, bgColor) : lighten(0.03, bgColor);
      })()}`,
    },

    '&:focus': {
      boxShadow: `${rgba(theme.color.secondary, 1)} 0 0 0 1px inset`,
      outline: 'none',
    },
  })
);
