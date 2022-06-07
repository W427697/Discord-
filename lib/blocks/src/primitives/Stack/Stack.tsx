import React, { AllHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Box, BoxBaseProps } from '..';
import { mapResponsiveValue, ResponsiveValue } from '../sprinkles.css';

type NativeProps = AllHTMLAttributes<HTMLDivElement>;

export interface StackProps extends NativeProps, BoxBaseProps {
  gap?: ResponsiveValue<'small' | 'medium' | 'large'>;
  orientation?: ResponsiveValue<'horizontal' | 'vertical'>;
  children?: ReactNode;
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ gap, orientation, css, ...props }, forwardedRef) => {
    const flexDirection = mapResponsiveValue(orientation, (value) => {
      switch (value) {
        case 'horizontal':
          return 'row';
        case 'vertical':
          return 'column';
        default:
          return 'row';
      }
    });
    const flexGap = mapResponsiveValue(gap, (value) => value);

    return (
      <Box
        ref={forwardedRef}
        css={{
          display: 'flex',
          flexDirection,
          gap: flexGap,
          ...css,
        }}
        {...props}
      />
    );
  }
);

Stack.defaultProps = {
  orientation: 'vertical',
};

export default Stack;
