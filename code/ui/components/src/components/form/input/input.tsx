import type { HTMLProps, SelectHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';
import type { CSSObject, FunctionInterpolation } from '@storybook/theming';
import { styled } from '@storybook/theming';

import TextareaAutoResize from 'react-textarea-autosize';

/**
 * these types are copied from `react-textarea-autosize`.
 * I copied them because of https://github.com/storybookjs/storybook/issues/18734
 * Maybe there's some bug in `tsup` or `react-textarea-autosize`?
 */
type TextareaPropsRaw = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
type Style = Omit<NonNullable<TextareaPropsRaw['style']>, 'maxHeight' | 'minHeight'> & {
  height?: number;
};
type TextareaHeightChangeMeta = {
  rowHeight: number;
};
export interface TextareaAutosizeProps extends Omit<TextareaPropsRaw, 'style'> {
  maxRows?: number;
  minRows?: number;
  onHeightChange?: (height: number, meta: TextareaHeightChangeMeta) => void;
  cacheMeasurements?: boolean;
  style?: Style;
}

const styleResets: CSSObject = {
  // resets
  appearance: 'none',
  border: '0 none',
  boxSizing: 'inherit',
  display: ' block',
  margin: ' 0',
  background: 'transparent',
  padding: 0,
  fontSize: 'inherit',
  position: 'relative',
};

const styles: FunctionInterpolation = ({ theme }) => ({
  ...(styleResets as any),

  transition: 'box-shadow 200ms ease-out, opacity 200ms ease-out',
  color: theme.input.color || 'inherit',
  background: theme.input.background,
  boxShadow: `${theme.input.border} 0 0 0 1px inset`,
  borderRadius: theme.input.borderRadius,
  fontSize: theme.typography.size.s2 - 1,
  lineHeight: '20px',
  padding: '6px 10px', // 32
  boxSizing: 'border-box',
  height: 32,

  '&[type="file"]': {
    height: 'auto',
  },

  '&:focus': {
    boxShadow: `${theme.color.secondary} 0 0 0 1px inset`,
    outline: 'none',
  },
  '&[disabled]': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },

  '&:-webkit-autofill': { WebkitBoxShadow: `0 0 0 3em ${theme.color.lightest} inset` },

  '&::placeholder': {
    color: theme.textMutedColor,
    opacity: 1,
  },
});

export type Sizes = '100%' | 'flex' | 'auto';
export type Alignments = 'end' | 'center' | 'start';
export type ValidationStates = 'valid' | 'error' | 'warn';

const sizes: FunctionInterpolation<{ size?: Sizes }> = ({ size }) => {
  switch (size) {
    case '100%': {
      return { width: '100%' };
    }
    case 'flex': {
      return { flex: 1 };
    }
    case 'auto':
    default: {
      return { display: 'inline' };
    }
  }
};
const alignment: FunctionInterpolation<{
  size?: Sizes;
  align?: Alignments;
  valid?: ValidationStates;
  height?: number;
}> = ({ align }) => {
  switch (align) {
    case 'end': {
      return { textAlign: 'right' };
    }
    case 'center': {
      return { textAlign: 'center' };
    }
    case 'start':
    default: {
      return { textAlign: 'left' };
    }
  }
};
const validation: FunctionInterpolation<{ valid: ValidationStates }> = ({ valid, theme }) => {
  switch (valid) {
    case 'valid': {
      return { boxShadow: `${theme.color.positive} 0 0 0 1px inset !important` };
    }
    case 'error': {
      return { boxShadow: `${theme.color.negative} 0 0 0 1px inset !important` };
    }
    case 'warn': {
      return {
        boxShadow: `${theme.color.warning} 0 0 0 1px inset`,
      };
    }
    case undefined:
    case null:
    default: {
      return {};
    }
  }
};

type InputProps = Omit<
  HTMLProps<HTMLInputElement>,
  keyof {
    size?: Sizes;
    align?: Alignments;
    valid?: ValidationStates;
    height?: number;
  }
> & {
  size?: Sizes;
  align?: Alignments;
  valid?: ValidationStates;
  height?: number;
};
export const Input = Object.assign(
  styled(
    forwardRef<any, InputProps>(function Input({ size, valid, align, name, ...props }, ref) {
      return <input {...props} aria-label={name} ref={ref} />;
    })
  )<{
    size?: Sizes;
    align?: Alignments;
    valid?: ValidationStates;
    height?: number;
  }>(styles, sizes, alignment, validation, {
    minHeight: 32,
  }),
  {
    displayName: 'Input',
  }
);

type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  keyof {
    size?: Sizes;
    align?: Alignments;
    valid?: ValidationStates;
    height?: number;
  }
> & {
  size?: Sizes;
  align?: Alignments;
  valid?: ValidationStates;
  height?: number;
};
export const Select = Object.assign(
  styled(
    forwardRef<any, SelectProps>(function Select({ size, valid, align, name, ...props }, ref) {
      return <select {...props} aria-label={name} ref={ref} />;
    })
  )<SelectProps>(styles, sizes, validation, {
    height: 32,
    userSelect: 'none',
    paddingRight: 20,
    appearance: 'menulist',
  }),
  {
    displayName: 'Select',
  }
);

type TextareaProps = Omit<
  TextareaAutosizeProps,
  keyof {
    size?: Sizes;
    align?: Alignments;
    valid?: ValidationStates;
    height?: number;
  }
> & {
  size?: Sizes;
  align?: Alignments;
  valid?: ValidationStates;
  height?: number;
} & React.RefAttributes<HTMLTextAreaElement>;
export const Textarea = Object.assign(
  styled(
    forwardRef<any, TextareaProps>(function Textarea({ size, valid, align, name, ...props }, ref) {
      return <TextareaAutoResize {...props} aria-label={name} ref={ref} />;
    })
  )<TextareaProps>(styles, sizes, alignment, validation, ({ height = 400 }) => ({
    overflow: 'visible',
    maxHeight: height,
  })),
  {
    displayName: 'Textarea',
  }
);
