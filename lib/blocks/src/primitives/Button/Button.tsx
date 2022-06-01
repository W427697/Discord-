import React, { AllHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Box, BoxBaseProps } from '..';

type NativeButtonProps = AllHTMLAttributes<HTMLButtonElement>;

export interface ButtonProps extends NativeButtonProps, BoxBaseProps {
  type?: 'button' | 'submit' | 'reset';
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, forwardedRef) => {
  return (
    <Box
      ref={forwardedRef}
      as="button"
      href="#"
      type="button"
      {...props}
      css={{
        padding: 'medium',
        background: 'blue-100',
        ...props.css,
      }}
    />
  );
});

export default Button;
