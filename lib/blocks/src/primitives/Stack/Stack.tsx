import React, { AllHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Box, BoxBaseProps } from '..';
import { mapResponsiveValue, ResponsiveValue } from '../sprinkles.css';
import { vars } from '../theme.css';

type NativeProps = AllHTMLAttributes<HTMLDivElement>;

export const orientationValues = {
  horizontal: 'horizontal',
  vertical: 'vertical',
};

export interface StackProps extends NativeProps, BoxBaseProps {
  gap?: ResponsiveValue<keyof typeof vars.space>;
  orientation?: ResponsiveValue<keyof typeof orientationValues>;
  children?: ReactNode;
}

/**
 * Stack creates stacked layout applied to its children.
 * Under the hood, it uses `flexbox` and `gap` CSS properties.
 * Both `gap` and `orientation` support responsive values:
 * `gap={["small", "medium", "large"]}`
 * which is equivalent to
 * `gap={{ mobile: "small", tablet: "medium", desktop: "large" }}`
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ gap, orientation = orientationValues.vertical, css, ...props }, forwardedRef) => {
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

export default Stack;
