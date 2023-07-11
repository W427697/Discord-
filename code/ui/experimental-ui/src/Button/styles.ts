import { styled } from '@storybook/theming';
import { darken, lighten, rgba } from 'polished';
import type { ButtonProps } from './Button';

export const ButtonWrapper = styled.button<{
  btnType: ButtonProps['type'];
  size: ButtonProps['size'];
  disabled: ButtonProps['disabled'];
  active: ButtonProps['active'];
}>(({ theme, btnType, size, disabled, active }) => ({
  border: 0,
  cursor: disabled ? 'not-allowed !important' : 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  overflow: 'hidden',
  padding: '0 16px',
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
    if (btnType === 'primary') return theme.color.secondary;
    if (btnType === 'secondary') return theme.button.background;
    if (btnType === 'tertiary' && active) return theme.background.hoverable;
    return 'transparent';
  })()}`,
  color: `${(() => {
    if (btnType === 'primary') return theme.color.lightest;
    if (btnType === 'secondary') return theme.input.color;
    if (btnType === 'tertiary') return theme.color.mediumdark;
    return theme.input.color;
  })()}`,
  boxShadow: btnType === 'primary' ? 'none' : `${theme.button.border} 0 0 0 1px inset`,
  borderRadius: theme.input.borderRadius,

  '&:hover': {
    background: `${(() => {
      let bgColor = theme.color.secondary;
      if (btnType === 'primary') bgColor = theme.color.secondary;
      if (btnType === 'secondary') bgColor = theme.button.background;

      return theme.base === 'light' ? darken(0.02, bgColor) : lighten(0.03, bgColor);
    })()}`,
  },

  '&:active': {
    background: `${(() => {
      let bgColor = theme.color.secondary;
      if (btnType === 'primary') bgColor = theme.color.secondary;
      if (btnType === 'secondary') bgColor = theme.button.background;

      return theme.base === 'light' ? darken(0.02, bgColor) : lighten(0.03, bgColor);
    })()}`,
  },

  '&:focus': {
    boxShadow: `${rgba(theme.color.secondary, 1)} 0 0 0 1px inset`,
    outline: 'none',
  },
}));
