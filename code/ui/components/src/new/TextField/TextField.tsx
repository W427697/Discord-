import React, { forwardRef } from 'react';
import { styled } from '@storybook/theming';

interface TextFieldProps {
  disabled?: boolean;
  placeholder?: string;
  value?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(({ ...props }, ref) => {
  return <StyledTextField ref={ref} {...props} />;
});

TextField.displayName = 'TextField';

const StyledTextField = styled.input(({ theme }) => ({
  // resets
  appearance: 'none',
  border: '0 none',
  margin: ' 0',
  position: 'relative',

  // styles
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '32px',
  transition: 'box-shadow 200ms ease-out, opacity 200ms ease-out',
  color: theme.input.color,
  background: theme.input.background,
  boxShadow: `${theme.input.border} 0 0 0 1px inset`,
  borderRadius: theme.input.borderRadius,
  fontSize: theme.typography.size.s2 - 1,
  padding: '0 10px',
  boxSizing: 'border-box',

  '&:focus': {
    boxShadow: `${theme.color.secondary} 0 0 0 1px inset`,
    outline: 'none',
  },

  '&[disabled]': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },

  '&:-webkit-autofill': {
    WebkitBoxShadow: `0 0 0 3em ${theme.color.lightest} inset`,
  },

  '&::placeholder': {
    color: theme.textMutedColor,
    opacity: 1,
  },
}));
