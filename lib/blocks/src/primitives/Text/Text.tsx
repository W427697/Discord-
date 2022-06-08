import React, { AllHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Box, BoxBaseProps } from '../Box/Box';
import { getRecipe, sizes, TextVariants, tones } from './Text.css';

type NativeProps = Omit<AllHTMLAttributes<HTMLParagraphElement>, 'size'>;

export interface TextProps extends NativeProps, BoxBaseProps, TextVariants {
  size?: keyof typeof sizes;
  tone?: keyof typeof tones;
  children?: ReactNode;
}

export const Text = forwardRef<HTMLSpanElement, TextProps>(
  ({ size, tone, ...props }, forwardedRef) => {
    const className = getRecipe({ size, tone });
    return <Box ref={forwardedRef} as="p" {...props} className={className} />;
  }
);
