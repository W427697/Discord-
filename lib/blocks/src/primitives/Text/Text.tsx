import React, { AllHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Box, BoxBaseProps } from '../Box/Box';
import { getRecipe, TextVariants } from './Text.css';

type NativeProps = AllHTMLAttributes<HTMLDivElement>;

export interface TextProps extends NativeProps, BoxBaseProps, TextVariants {
  children?: ReactNode;
}

export const Text = forwardRef<HTMLSpanElement, TextProps>((props, forwardedRef) => {
  const className = getRecipe({ variant: props.variant });
  return <Box ref={forwardedRef} as="span" {...props} className={className} />;
});
