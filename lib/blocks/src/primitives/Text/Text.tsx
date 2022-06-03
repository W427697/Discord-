import React, { AllHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Box, BoxBaseProps } from '../Box/Box';
import { ResponsiveValue } from '../sprinkles.css';
import { text } from './Text.css';

type NativeProps = AllHTMLAttributes<HTMLDivElement>;

export interface TextProps extends NativeProps, BoxBaseProps {
  children?: ReactNode;
  variant: ResponsiveValue<'heading' | 'body' | 'caption'>;
}

export const Text = forwardRef<HTMLSpanElement, TextProps>((props, forwardedRef) => {
  const className = text({ variant: props.variant });
  return <Box ref={forwardedRef} as="span" {...props} className={className} />;
});
